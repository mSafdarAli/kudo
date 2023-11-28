const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  services: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  notes: String,
  rating: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true,
},
});

module.exports = mongoose.model('Vendor', VendorSchema);
