const express = require('express');
const router = express.Router();
const multer = require('multer');
const Video = require('../models/Video');
const path = require('path');
const fs = require('fs'); // Required for Streaming

// --- 1. STORAGE CONFIGURATION (Multer) ---
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        // Save as: video-TIMESTAMP.mp4
        cb(null, 'video-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


// --- 2. UPLOAD ROUTE (With Fake AI + Socket.io) ---
// @route   POST /api/videos/upload
// @route   POST /api/videos/upload
router.post('/upload', upload.single('video'), async (req, res) => {
    try {
        const { title, uploader } = req.body;
        const videoUrl = req.file.filename;

        console.log("1. Starting Upload...");

        const newVideo = new Video({
            title,
            videoUrl,
            uploader,
            sensitivityStatus: 'processing' 
        });

        const savedVideo = await newVideo.save();
        console.log("2. Video Saved to DB:", savedVideo._id);

        res.status(201).json({ message: 'Upload successful!', video: savedVideo });

        // --- FAKE AI START ---
        console.log("3. AI Timer Started (Waiting 5s)...");
        
        setTimeout(async () => {
            try {
                console.log("4. AI Waking Up...");
                const randomResult = Math.random() > 0.2 ? 'safe' : 'flagged';
                
                const updatedVideo = await Video.findByIdAndUpdate(
                    savedVideo._id, 
                    { sensitivityStatus: randomResult },
                    { new: true }
                );
                
                console.log(`5. DB Updated: Video is ${randomResult}`);

                const io = req.app.get('io');
                if (io) {
                    io.emit('videoStatusUpdate', updatedVideo);
                    console.log("6. Socket Event Sent to Frontend ⚡");
                } else {
                    console.error("❌ ERROR: Socket.io instance not found!");
                }
            } catch (err) {
                console.error("❌ AI Error:", err);
            }
        }, 5000);

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: 'Upload Failed', error: error.message });
    }
});


// --- 3. GET ALL VIDEOS ROUTE ---
// @route   GET /api/videos
router.get('/', async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// --- 4. STREAMING ROUTE (Netflix-Style Chunks) ---
// @route   GET /api/videos/stream/:filename
router.get('/stream/:filename', (req, res) => {
    const filePath = path.join(__dirname, '../uploads/', req.params.filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Video file not found' });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // If browser requests a specific "Chunk" (Range Request)
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        
        const file = fs.createReadStream(filePath, { start, end });
        
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, head); // 206 = Partial Content
        file.pipe(res);
    } 
    // First request (Send whole file info)
    else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
});


// --- 5. DELETE ROUTE ---
// @route   DELETE /api/videos/:id
router.delete('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        // Optional: Delete the actual file from uploads folder
        const filePath = path.join(__dirname, '../uploads/', video.videoUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete from Database
        await Video.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// --- 6. LIKE ROUTE ---
// @route   PUT /api/videos/like/:id
router.put('/like/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        // Increase likes
        video.likes += 1;
        await video.save();

        res.json(video);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;