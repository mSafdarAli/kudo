// models/company.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    unique: true,
  },
  user: String,
  lastContacted: {
    type: String,
  },
  contacts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Contact',
    }
  ],
  websiteLink: String,
  contact: String,
  instagramLink: String,
  leads: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
    }
  ],
  schedules: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Schedule',
    }
  ],
  initialContactDate: Date,
  industry: String,
  leadSource: String,
  companyClassification: String,
  notes: String,
  initialContactDiscussion: String,
  howItLeftOff: String,
  targetValue: String,
  lastContacted: String,
  products: [
    {
      productName: String,
      amount: String,
    }
  ],
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
