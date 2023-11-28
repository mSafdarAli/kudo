const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) => {
  // Construct the full path to the file
  const fullPath = path.join(__dirname, '..', 'public', 'files', filePath);

  // Use fs.unlink to delete the file
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
    } else {
      console.log('File deleted successfully:', filePath);
    }
  });
};

module.exports = { deleteFile };
