// middleware/fileUpload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories if they don't exist
fs.mkdirSync('uploads/images', { recursive: true });
fs.mkdirSync('uploads/documents', { recursive: true });

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (file.fieldname === 'image') {
      cb(null, 'uploads/images');
    } else if (file.fieldname === 'document') {
      cb(null, 'uploads/documents');
    } else {
      cb(null, 'uploads');
    }
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept all file types
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  }
});

// Handle file uploads
exports.fileUpload = (req, res, next) => {
  const uploadMiddleware = upload.any(); // Accept any field name

  uploadMiddleware(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ success: false, message: err.message });
    }
    
    // Process files and add them to the request body
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (file.fieldname === 'image') {
          req.body.imageUrl = file.path;
        } else if (file.fieldname === 'document') {
          req.body.documentUrl = file.path;
        }
      });
    }
    
    // Everything went fine
    next();
  });
};