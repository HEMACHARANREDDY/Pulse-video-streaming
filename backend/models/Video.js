const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    uploader: { type: String, required: true },
    likes: { type: Number, default: 0 },
    
    // NEW FIELD: Security Status
    sensitivityStatus: {
        type: String,
        enum: ['processing', 'safe', 'flagged'],
        default: 'processing' 
    },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);