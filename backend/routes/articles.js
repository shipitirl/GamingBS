const express = require("express");
const mongoose = require("mongoose");

module.exports = (upload) => {
  const router = express.Router();
  const Article = require("../models/Article");

  // Debug middleware
  router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // GET all articles
  router.get("/", async (req, res) => {
    console.log("Fetching all articles...");
    try {
      const startTime = Date.now();
      const articles = await Article.find()
        .sort({ publishDate: -1 })
        .limit(20)
        .lean()
        .exec();

      const endTime = Date.now();
      console.log(`Found ${articles.length} articles in ${endTime - startTime}ms`);

      if (!articles || articles.length === 0) {
        console.log("No articles found, returning empty array");
        return res.json([]);
      }

      const sanitizedArticles = articles.map((article) => ({
        _id: article._id.toString(),
        title: article.title || "",
        description: article.description || "",
        image: article.imageId
          ? `/api/articles/image/${article.imageId}`
          : article.imageUrl || "/placeholder-news.jpg",
        category: article.category || "Latest",
        publishDate: article.publishDate || new Date(),
        author: article.author || "STAFF",
        tags: article.tags || [],
      }));

      res.json(sanitizedArticles);
    } catch (error) {
      console.error("Error in GET /articles:", error);
      res.status(500).json({
        message: "Error fetching articles",
        error: error.message,
      });
    }
  });

  // GET articles by category
  router.get("/category/:category", async (req, res) => {
    const { category } = req.params;
    console.log(`Fetching articles for category: ${category}`);
    try {
      const startTime = Date.now();
      const articles = await Article.find({
        category: { $regex: new RegExp(category, "i") },
      })
        .sort({ publishDate: -1 })
        .limit(20)
        .lean()
        .exec();

      const endTime = Date.now();
      console.log(
        `Found ${articles.length} articles for category ${category} in ${
          endTime - startTime
        }ms`
      );

      if (!articles || articles.length === 0) {
        console.log(`No articles found for category: ${category}`);
        return res.json([]);
      }

      const sanitizedArticles = articles.map((article) => ({
        _id: article._id.toString(),
        title: article.title || "",
        description: article.description || "",
        image: article.imageId
          ? `/api/articles/image/${article.imageId}`
          : article.imageUrl || "/placeholder-news.jpg",
        category: article.category || "Latest",
        publishDate: article.publishDate || new Date(),
        author: article.author || "STAFF",
        tags: article.tags || [],
      }));

      res.json(sanitizedArticles);
    } catch (error) {
      console.error(`Error in GET /articles/category/${category}:`, error);
      res.status(500).json({
        message: `Error fetching articles for category: ${category}`,
        error: error.message,
      });
    }
  });

  // POST new article with GridFS file upload
  router.post("/", upload.single("file"), async (req, res) => {
    console.log("Creating new article:", req.body.title);
    try {
      const article = new Article({
        title: req.body.title,
        description: req.body.description,
        imageId: req.file ? req.file.id : undefined,
        imageUrl: req.file ? undefined : req.body.imageUrl,
        category: req.body.category,
        author: req.body.author || "STAFF",
        tags: req.body.tags,
        publishDate: new Date(),
      });

      const savedArticle = await article.save();
      console.log("Article created successfully:", savedArticle._id);
      res.status(201).json(savedArticle);
    } catch (error) {
      if (error.code === "INVALID_FILE_TYPE") {
        return res.status(400).json({
          message: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
        });
      }
      console.error("Error creating article:", error);
      res.status(500).json({
        message: "Error creating article",
        error: error.message,
      });
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
      res.status(500).json({
        message: "Error fetching image",
        error: error.message,
      });
    }
  });

  return router;
};