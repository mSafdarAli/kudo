// models/lead.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leadSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  notes: String,
  company: {
    type: String,
    required: true,
  }
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
