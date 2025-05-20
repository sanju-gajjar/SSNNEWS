const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    location: { type: String, default: '' },
    // ...existing fields...
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
