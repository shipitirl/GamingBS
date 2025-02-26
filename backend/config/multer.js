const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

const createUpload = (mongooseConnection) => {
  const storage = new GridFsStorage({
    db: mongooseConnection, // Use the provided Mongoose connection
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        const filename = `${Date.now()}-${file.originalname}`;
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    }
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: 150 * 1024 * 1024, // 150MB limit
      files: 10 // Maximum 10 files per upload
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error('Invalid file type');
        error.code = 'INVALID_FILE_TYPE';
        return cb(error, false);
      }
      cb(null, true);
    }
  });

  return upload;
};

module.exports = createUpload;