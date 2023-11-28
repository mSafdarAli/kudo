const multer = require('multer');

// Set storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/products'); // Specify the destination folder for saving the images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = uniqueSuffix + '-' + file.originalname;
    cb(null, fileName);
  },
});

// Create the multer upload object
const upload = multer({ storage });

module.exports = upload;
