require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const TwitterStrategy = require("passport-twitter").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const rateLimit = require("express-rate-limit");
const path = require('path');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Connect to MongoDB before starting the server
connectDB().then(() => {
  // Routes
  const articlesRouter = require('./routes/articles');
  app.use('/api/articles', articlesRouter);

  // Test route
  app.get('/test', (req, res) => {
    res.json({ message: 'Backend server is running!' });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err.message });
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test the server: http://localhost:${PORT}/test`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error('MongoDB error after initial connection:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
