const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    console.log(req.body);
    const { username, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username)
    console.log(password)
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        const isPasswordMatch = await user.matchPassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});

router.get('/verify-token', (req, res) => {
    const token = req.cookies?.token;
    console.log(req.cookies)
    console.log(req.get('host'))
    console.log(req.get('origin'))
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        res.status(200).json({ message: 'Token is valid', decoded });
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token', error: err.message });
    }
});

// Get user details
router.get('/user/', async (req, res) => {
    const token = req.cookies?.token;
    
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is missing' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log (decoded);
    try {
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user details', error: err.message });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: false }); // Adjust 'secure' for HTTPS
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
