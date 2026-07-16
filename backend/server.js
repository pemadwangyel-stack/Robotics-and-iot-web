const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Explicitly tell dotenv exactly where to find the file
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== HEALTH CHECK ROUTE =====
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Backend is running!', 
        timestamp: new Date() 
    });
});

// ===== TEST ROUTE =====
app.get('/api/test', (req, res) => {
    res.json({ message: "Backend is officially alive and tracking!" });
});

// ===== HOOK UP ROUTES =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admission', require('./routes/admission'));
app.use('/api/dashboard', require('./routes/dashboard'));

// ===== DEBUGGING =====
console.log("🔍 Checking loaded URI:", process.env.MONGO_URI ? "Found it!" : "❌ MONGO_URI is missing or undefined!");

const DB_URI = process.env.MONGO_URI;

if (!DB_URI) {
    console.error("❌ ERROR: Cannot start server because MONGO_URI is not loaded from your .env file!");
    process.exit(1); 
}

// ===== MONGODB CONNECTION =====
mongoose.connect(DB_URI)
    .then(() => console.log("🍃 MongoDB Database Connected Successfully!"))
    .catch((err) => {
        console.error("❌ Database connection error details:");
        console.error(err);
    });

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running smoothly on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Dashboard stats: http://localhost:${PORT}/api/dashboard/stats`);
    console.log(`📊 Students: http://localhost:${PORT}/api/dashboard/students`);
});