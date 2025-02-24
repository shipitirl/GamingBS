const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { upload } = require('../config/multer');

let gfs;
let gridfsBucket;

mongoose.connection.once('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
  gfs = {
    find: (options) => gridfsBucket.find(options),
    createReadStream: (filename) => gridfsBucket.openDownloadStreamByName(filename),
    createWriteStream: (options) => gridfsBucket.openUploadStream(options),
    delete: (id) => gridfsBucket.delete(id)
  };
});

// Debug middleware
router.use((req, res, next) => {
  console.log('\nUpload request received:');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  next();
});

// Upload single image
router.post('/single', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    console.log('File uploaded:', req.file);
    
    res.json({
      success: true,
      file: {
        id: req.file.id,
        filename: req.file.filename,
        contentType: req.file.contentType
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Upload multiple images
router.post('/multiple', upload.array('images', 10), async (req, res) => {
  try {
    console.log('Processing multiple file upload');
    console.log('Files received:', req.files);

    if (!req.files || req.files.length === 0) {
      console.log('No files received');
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const fileInfos = req.files.map(file => ({
      id: file.id,
      filename: file.filename,
      contentType: file.mimetype,
      size: file.size
    }));

    console.log('Upload successful. File infos:', fileInfos);

    res.json({
      success: true,
      files: fileInfos
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get image by filename
router.get('/:filename', async (req, res) => {
  try {
    const files = await gfs.find({ filename: req.params.filename }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    const readStream = gfs.createReadStream(req.params.filename);
    readStream.on('error', (error) => {
      console.error('Read stream error:', error);
      res.status(500).json({ message: 'Error reading file' });
    });

    res.set('Content-Type', files[0].contentType);
    readStream.pipe(res);
  } catch (error) {
    console.error('File retrieval error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete image
router.delete('/:id', async (req, res) => {
  try {
    await gfs.delete(new mongoose.Types.ObjectId(req.params.id));
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 