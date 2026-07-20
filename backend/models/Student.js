const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    citizenshipStatus: { type: String, required: true, default: 'Bhutanese' },
    cidNumber: { type: String }, // Optional by default
    passportNumber: { type: String },
    schoolName: { type: String, required: true }, // Added field matching frontend
    className: { type: String, required: true },  // Added field matching frontend
    mobileNumber: { type: String, required: true },
    isWhatsAppSame: { type: Boolean, default: true },
    whatsAppNumber: { type: String },
    emailAddress: { type: String, required: true },
    guardianName: { type: String },
    relationship: { type: String },
    courseTrack: { type: String, required: true },
    safetyConsent: { type: Boolean, required: true },
    registrationDate: { type: Date, default: Date.now },

    // --- DASHBOARD TRACKING FIELDS ---
    feesPaid: { type: Number, default: 0 },
    totalFees: { type: Number, default: 7500 },
    paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Partial'], default: 'Pending' },
    attendanceCount: { type: Number, default: 0 },
    
    // --- STATUS FIELDS ---
    status: { type: String, enum: ['Active', 'Pending', 'Completed', 'Paid'], default: 'Pending' }, // Added 'Paid' here
    amountPaid: { type: Number, default: 0 },

    // --- EXTRA FIELDS (for frontend compatibility) ---
    school: { type: String, default: '' },
    age: { type: Number, default: 0 },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    guardian: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);