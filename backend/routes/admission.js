const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// 📥 ROUTE: Fetch all student registration applications for the admin dashboard
// URL Path: GET /api/admission
router.get('/', async (req, res) => {
    try {
        // Fetch all registration records from MongoDB sorted by latest first
        const applications = await Student.find().sort({ registrationDate: -1 });
        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (err) {
        console.error('❌ Error fetching dashboard admission lists:', err);
        res.status(500).json({
            success: false,
            message: 'Server error. Failed to retrieve application files.',
            error: err.message
        });
    }
});

// 📬 ROUTE: Handle new student enrollment data
// URL Path: POST /api/admission/register
router.post('/register', async (req, res) => {
    try {
        console.log("📥 Incoming Form Body Data:", req.body);

        // Create a new student record using the data sent from the frontend form
        const newStudent = new Student(req.body);
        
        // Save directly to MongoDB Atlas
        await newStudent.save();
        
        console.log("🍃 Success! Student written directly to MongoDB Atlas.");
        return res.status(201).json({
            success: true,
            message: 'Student application saved successfully to MongoDB!',
            student: newStudent
        });

    } catch (err) {
        console.error('❌ MongoDB Direct Save Failure:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Database save failed. Record not saved.',
            error: err.message,
            details: err.errors ? Object.keys(err.errors).map(key => ({ field: key, message: err.errors[key].message })) : undefined
        });
    }
});

module.exports = router;