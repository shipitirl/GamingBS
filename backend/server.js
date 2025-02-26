require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/gaming_news', {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log('MongoDB Connected Successfully');

    // List all collections to verify connection
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if we can't connect to database
  }
};

// Connect to MongoDB and set up routes
connectDB().then(() => {
  // Configure GridFS storage
  const storage = new GridFsStorage({
    db: mongoose.connection,
    file: (req, file) => {
      return {
        filename: `${Date.now()}-${file.originalname}`,
        bucketName: "uploads", // Collection name in MongoDB
      };
    },
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: 150 * 1024 * 1024, // 150MB limit
      files: 10, // Maximum 10 files per upload
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Invalid file type");
        error.code = "INVALID_FILE_TYPE";
        return cb(error, false);
      }
      cb(null, true);
    },
  });

  // Routes
  const articlesRouter = require("./routes/articles")(upload); // Pass upload middleware to articles router
  app.use("/api/articles", articlesRouter);

  // Test route
  app.get("/test", (req, res) => {
    res.json({ message: "Backend server is running!" });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something broke!", error: err.message });
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test the server: http://localhost:${PORT}/test`);
  });
}).catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

// Handle MongoDB connection errors after initial connection
mongoose.connection.on("error", (err) => {
  console.error("MongoDB error after initial connection:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});