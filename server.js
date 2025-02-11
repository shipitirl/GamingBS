require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageUrl: String
});
const Article = mongoose.model("Article", articleSchema);

// File Upload Setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create Article
app.post("/articles", upload.single("thumbnail"), async (req, res) => {
    const { title, description } = req.body;
    const imageUrl = `data:image/png;base64,${req.file.buffer.toString("base64")}`;

    const newArticle = new Article({ title, description, imageUrl });
    await newArticle.save();
    res.json({ message: "Article added!" });
});

// Get Articles
app.get("/articles", async (req, res) => {
    const articles = await Article.find();
    res.json(articles);
});

// Edit Article
app.put("/articles/:id", async (req, res) => {
    await Article.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Article updated!" });
});

// Delete Article
app.delete("/articles/:id", async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Article deleted!" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
