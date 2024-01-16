const mongoose = require('mongoose');

const { Schema } = mongoose;


const memberSchema = new Schema({
    memberid: {
        type: String,
        required: true,
        unique: true,//KEY설정
    },
    memberpwd: {
        type: String,
        required: true,
    },
    membername: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: false,
    },
    married: {
        type: Boolean,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Member', memberSchema);
