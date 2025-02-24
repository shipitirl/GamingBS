const mongoose = require('mongoose');

// Check if the model already exists before defining it
const Article = mongoose.models.Article || mongoose.model('Article', new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  tags: {
    type: String
  },
  author: {
    type: String,
    default: 'STAFF'
  },
  category: {
    type: String,
    required: true,
    enum: ['Latest', 'Games', 'Movies', 'TV', 'PlayStation', 'Xbox', 'Nintendo']
  },
  platform: {
    type: String,
    enum: ['', 'PlayStation', 'Xbox', 'Nintendo', 'PC', 'Mobile', 'Multiple']
  },
  publishDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
}));

module.exports = Article; 