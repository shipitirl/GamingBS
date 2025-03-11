const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  author: { type: String },
  tags: [{ type: String }], // Array of strings
  images: [{ type: Schema.Types.ObjectId }], // Array of image paths
  publishDate: { type: Date, default: Date.now },
  upvotes: { type: Number, default: 0 } // Added for upvoting
});

module.exports = mongoose.model('Article', articleSchema);