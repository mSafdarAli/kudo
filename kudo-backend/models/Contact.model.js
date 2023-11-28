// models/contact.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  title: String,
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
