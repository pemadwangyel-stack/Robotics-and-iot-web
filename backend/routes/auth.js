const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register a brand new user for the IT Training Dashboard
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // 1. Check if a user with that email already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists!' });
        }

        // 2. Create a new user instance using our model blueprint
        user = new User({
            name,
            email,
            password,
            role
        });

        // 3. Save the user directly into your MongoDB cloud cluster
        await user.save();

        res.status(201).json({ 
            message: '🎉 User registered successfully inside the MongoDB cloud!',
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during registration.');
    }
});

// @route   POST api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // For now, simple password check (add bcrypt later)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({ 
            success: true,
            message: 'Login successful!',
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during login.');
    }
});

module.exports = router;