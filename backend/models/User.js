const mongoose = require('mongoose');

// Define what a User looks like in our database
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Prevents two users from signing up with the same email
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'trainer', 'trainee'], // Restricts the role to only these choices
        default: 'trainee'
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically tracks when the user signed up
    }
});

// Create the model using the blueprint schema
module.exports = mongoose.model('User', UserSchema);