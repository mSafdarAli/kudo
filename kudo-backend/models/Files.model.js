const mongoose = require('mongoose');

const filesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  entryDate: {
    type: Date,
    required: true,
  },
  filename: {
    type: String,
    required: true,
    unique: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

const Files = mongoose.model('Files', filesSchema);

module.exports = Files;
