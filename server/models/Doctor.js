const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    specialty: {
        type: String,
        required: [true, 'Please add a specialty']
    },
    experience: {
        type: Number,
        required: [true, 'Please add years of experience']
    },
    workingHours: {
        start: { type: String, required: true }, // e.g., "09:00"
        end: { type: String, required: true }    // e.g., "17:00"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
