const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    surname: {
        type: String,
        required: true,
    },
    otherName : {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,  // Store base64 string
        required: false,
    },
});

module.exports = mongoose.model('User', userSchema);
