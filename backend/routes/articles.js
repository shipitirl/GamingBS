const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');
//const path = require('path'); [delete later]
//const fs = require('fs'); [delete later]
const { GridFsStorage } = require('multer-gridfs-storage');

module.exports = () => {
  const router = express.Router();
  const Article = require("../models/Article");

  // Debug middleware
  router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Wait for MongoDB connection before setting up GridFS
  let uploadMiddleware;
  mongoose.connection.once('open', () => {
    const storage = new GridFsStorage({
      db: mongoose.connection.db, // Use the open connection
      file: (req, file) => {
        return {
          filename: `${Date.now()}-${file.originalname}`,
          bucketName: 'uploads'
        };
      }
    });

    uploadMiddleware = multer({
      storage: storage,
      limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
    });
    console.log('GridFS storage initialized');
  });

  // GET all articles
  router.get("/", async (req, res) => {
    console.log("Fetching all articles...");
    try {
      const articles = await Article.find()
        .sort({ publishDate: -1 })
        .limit(20)
        .lean()
        .exec();

      const sanitizedArticles = articles.map((article) => {
        let imagePath = "/placeholder-news.jpg";
        if (article.imageIds && article.imageIds.length > 0) {
          imagePath = `/api/articles/image/${article.imageIds[0]}`;
        }
        return {
          _id: article._id.toString(),
          title: article.title || "",
          description: article.description || "",
          image: imagePath,
          category: article.category || "Latest",
          publishDate: article.publishDate || new Date(),
          author: article.author || "STAFF",
          tags: article.tags || [],
          upvotes: article.upvotes || 0
        };
      });

      res.json(sanitizedArticles);
    } catch (error) {
      console.error("Error in GET /articles:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // POST route with GridFS upload
  router.post('/', (req, res, next) => {
    if (!uploadMiddleware) {
      return res.status(503).json({ message: "Database connection not ready yet" });
    }
    uploadMiddleware.array('images', 5)(req, res, next);
  }, async (req, res) => {
    try {
      const { title, description, category, author, tags } = req.body;
      const imageIds = req.files ? req.files.map(file => file.id) : [];

      const article = new Article({
        title,
        description,
        category,
        author,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        imageIds: imageIds
      });

      await article.save();
      res.status(201).json(article);
    } catch (error) {
      console.error('Error creating article:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // GET single article by ID
  router.get("/:id", async (req, res) => {
    console.log(`Fetching article ${req.params.id}...`);
    try {
      const article = await Article.findById(req.params.id).lean().exec();
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      const sanitizedArticle = {
        _id: article._id.toString(),
        title: article.title || "",
        description: article.description || "",
        image: article.imageIds && article.imageIds.length > 0 
          ? `/api/articles/image/${article.imageIds[0]}` 
          : "/placeholder-news.jpg",
        category: article.category || "Latest",
        publishDate: article.publishDate || new Date(),
        author: article.author || "STAFF",
        tags: article.tags || [],
        upvotes: article.upvotes || 0
      };

      res.json(sanitizedArticle);
    } catch (error) {
      console.error(`Error fetching article ${req.params.id}:`, error);
      res.status(500).json({ message: error.message });
    }
  });

  // GET image by GridFS ID
  router.get("/image/:id", async (req, res) => {
    try {
      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });

      const fileId = new mongoose.Types.ObjectId(req.params.id);
      const files = await gfs.find({ _id: fileId }).toArray();

      if (!files || files.length === 0) {
        return res.status(404).json({ message: "File not found" });
      }

      const file = files[0];
      res.set("Content-Type", file.contentType);
      const readstream = gfs.openDownloadStream(file._id);
      readstream.pipe(res);
    } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // POST route to upvote an article
  router.post('/upvote/:id', async (req, res) => {
    try {
      const article = await Article.findById(req.params.id);
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      article.upvotes = (article.upvotes || 0) + 1;
      await article.save();
      res.json(article);
    } catch (error) {
      console.error('Error upvoting article:', error);
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};