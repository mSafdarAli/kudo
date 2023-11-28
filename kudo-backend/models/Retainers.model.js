const mongoose = require('mongoose');

const retainersSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    person: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    googleSheetLink: {
        type: String,
        required: true,
    },
    sheetName: {
        type: String,
        required: true,
    },
    timeFrame: {
        type: String,
        required: true,
    },
});

const Retainers = mongoose.model('Retainers', retainersSchema);

module.exports = Retainers;
