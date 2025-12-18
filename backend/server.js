const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http'); // New
const { Server } = require('socket.io'); // New

dotenv.config();

const app = express();
const server = http.createServer(app); // Wrap Express in HTTP server

// Setup Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Your Frontend URL
        methods: ["GET", "POST"]
    }
});

// Save 'io' so we can use it in routes
app.set('io', io);

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/videos', require('./routes/video'));

// Listen for Socket Connections
io.on('connection', (socket) => {
    console.log('⚡ New Client Connected: ' + socket.id);
    socket.on('disconnect', () => {
        console.log('Client Disconnected');
    });
});

// START SERVER (Use 'server.listen', not 'app.listen')
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});