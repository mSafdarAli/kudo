const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  client: {
    type: String,
    required: true
  },
  signedDate: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  services: {
    type: String,
    required: true
  },
  campaign: {
    type: String,
    required: true
  },
  monthlySpend: {
    type: Number,
    required: true
  },
  fileUrl: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
},
});

module.exports = mongoose.model('Contract', contractSchema);
