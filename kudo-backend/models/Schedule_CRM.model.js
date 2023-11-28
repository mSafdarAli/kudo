// models/schedule.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  typeOfLead: {
    type: String,
    required: true,
  },
  notes: String,
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
