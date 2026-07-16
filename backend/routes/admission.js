const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { addFallbackStudent } = require('../utils/fallbackStore');

// 📬 ROUTE: Handle new student enrollment data
router.post('/register', async (req, res) => {
    try {
        // Create a new student record using the data sent from the frontend form
        const newStudent = new Student(req.body);
        
        // Save it to MongoDB if available
        try {
            await newStudent.save();
            return res.status(201).json({
                success: true,
                message: 'Student application saved successfully!',
                student: newStudent.toObject()
            });
        } catch (dbErr) {
            const fallbackStudent = addFallbackStudent(req.body);
            console.warn('⚠️ MongoDB save failed, using in-memory fallback:', dbErr.message);
            return res.status(201).json({
                success: true,
                message: 'Student application saved locally while the database is unavailable.',
                student: fallbackStudent,
                warning: dbErr.message
            });
        }
    } catch (err) {
        console.error('❌ Error saving admission details:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Failed to submit application.',
            error: err.message,
            details: err.errors ? Object.keys(err.errors).map(key => ({ field: key, message: err.errors[key].message })) : undefined
        });
    }
});

module.exports = router;