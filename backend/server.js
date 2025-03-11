require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer"); // Add this import

console.log('Starting server...');

const app = express();

// Middleware
console.log('Setting up middleware...');
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
console.log('Connecting to MongoDB...');
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/gaming_news', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB Connected Successfully');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Routes setup and server start
console.log('Setting up routes...');
connectDB().then(() => {
  console.log('MongoDB connection established, proceeding...');

  // GridFS setup
  console.log('Setting up GridFS...');
  const storage = new GridFsStorage({
    db: mongoose.connection.db,
    file: (req, file) => {
      return {
        filename: `${Date.now()}-${file.originalname}`,
        bucketName: 'uploads'
      };
    }
  });

  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.fieldname === 'images') {
        cb(null, true);
      } else {
        cb(new Error('Field name must be "images"'));
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });

  console.log('Mounting routes...');
  const articlesRouter = require("./routes/articles")();
  app.use("/api/articles", articlesRouter);

  // Test route
  console.log('Setting up test route...');
  app.get("/test", (req, res) => {
    res.json({ message: "Backend server is running!" });
  });

  // Error handling middleware
  console.log('Setting up error handling...');
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something broke!", error: err.message });
  });

  console.log('Starting server on port 3001...');
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test the server: http://localhost:${PORT}/test`);
    console.log('Routes mounted and server started');
  });
}).catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

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