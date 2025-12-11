const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const slotSchema = new Schema({
    time : {
        type: String,
    },
    isBooked : {
        type: Boolean,
        default: false
    },
    isAvailable : {
        type: Boolean,
        default: true
    },
    patientId: {
        type: String
    },
    patientName: {
        type: String
    }
})

const dateSchedule = new Schema({
    date : {
        type: String
    },
    slots : [slotSchema]
})

const doctorSchema = new Schema({
    // Authentication
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
    // Basic Information
    name: {
        type: String
    },
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    
    // Personal Details
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', '']
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },
    
    // Location Information (for location-based search)
    location: {
        city: String,
        state: String,
        country: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    timezone: {
        type: String,
        default: 'Asia/Kolkata'
    },
    
    // Professional Details
    specialization: {
        type: String
    },
    qualification: {
        type: String
    },
    experience: {
        type: Number // years of experience
    },
    feesPerSession: {
        type: String
    },
    
    // License & Verification
    licenseNumber: {
        type: String
    },
    issuingAuthority: {
        type: String
    },
    licenseExpiryDate: {
        type: Date
    },
    licenseDocument: {
        type: String // path to uploaded document
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected', 'expired'],
        default: 'pending'
    },
    verificationDate: {
        type: Date
    },
    verificationNotes: {
        type: String
    },
    
    // Password Reset
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    },
    
    // Registration
    registrationDate: {
        type: Date,
        default: Date.now
    },
    
    // Appointments
    dates : [dateSchedule]
});

const Doctor = mongoose.model('Doctor', doctorSchema);
const Slot = mongoose.model('Slot', slotSchema);
const DateSchedule = mongoose.model('DateSchedule', dateSchedule);

module.exports = {
    Doctor,
    Slot,
    DateSchedule
};