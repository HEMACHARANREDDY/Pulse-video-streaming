const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// YOUR CLIENT ID HERE TOO
const client = new OAuth2Client("891784327014-m6unitau6l264ii62qt7to7g5vglu758.apps.googleusercontent.com");

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'viewer'
        });

        await user.save();
        res.status(201).json({ message: 'User Registered Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ 
            token, 
            user: { id: user._id, username: user.username, role: user.role },
            message: 'Login Successful'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/auth/google
// @desc    Google Login/Register
router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;
        
        // 1. Verify Google Token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: "891784327014-m6unitau6l264ii62qt7to7g5vglu758.apps.googleusercontent.com"
        });
        const { name, email, picture } = ticket.getPayload();

        // 2. Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // 3. If new, Create User (Random Password)
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = new User({
                username: name,
                email,
                password: hashedPassword,
                role: 'viewer' // Default role for Google Users
            });
            await user.save();
        }

        // 4. Generate JWT Token
        const jwtToken = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ 
            token: jwtToken, 
            user: { id: user._id, username: user.username, role: user.role } 
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: 'Google Auth Failed' });
    }
});

module.exports = router;