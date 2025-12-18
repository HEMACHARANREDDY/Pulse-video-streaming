const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // Role-Based Access Control (RBAC) Field
    role: {
        type: String,
        enum: ['viewer', 'editor', 'admin'], // Strict roles defined in PDF
        default: 'viewer' // Default role is read-only
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);