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

        const {
            fullName,
            dob,
            gender,
            citizenshipStatus,
            cidNumber,
            passportNumber,
            schoolName,
            className,
            mobileNumber,
            isWhatsAppSame,
            whatsAppNumber,
            emailAddress,
            guardianName,
            relationship,
            courseTrack,
            safetyConsent
        } = req.body;

        // Safely parse date or fallback to current date if missing
        const parsedDob = dob ? new Date(dob) : new Date();

        // Map and sanitize the incoming frontend payload to avoid Schema validation rejections
        const studentData = {
            fullName: fullName || 'N/A',
            dob: isNaN(parsedDob.getTime()) ? new Date() : parsedDob,
            gender: gender || 'Other',
            citizenshipStatus: citizenshipStatus || 'Bhutanese',
            cidNumber: cidNumber || '',
            passportNumber: passportNumber || '',
            schoolName: schoolName || 'N/A',
            className: className || 'N/A',
            mobileNumber: mobileNumber || 'N/A',
            isWhatsAppSame: Boolean(isWhatsAppSame),
            whatsAppNumber: whatsAppNumber || mobileNumber || '',
            emailAddress: emailAddress || 'N/A',
            guardianName: guardianName || '',
            relationship: relationship || '',
            courseTrack: courseTrack || 'General',
            safetyConsent: Boolean(safetyConsent),
            
            // Explicitly set safe schema default values
            status: 'Pending',
            paymentStatus: 'Pending',
            feesPaid: 0,
            totalFees: 7500,
            attendanceCount: 0,
            amountPaid: 0
        };

        // Create a new student record
        const newStudent = new Student(studentData);
        
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