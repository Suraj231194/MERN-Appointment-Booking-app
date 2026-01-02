const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    startTime: {
        type: Date, // ISO Date
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'BOOKED', 'BLOCKED', 'CANCELLED'],
        default: 'AVAILABLE'
    }
}, {
    timestamps: true
});

// Compound unique index to prevent duplicate slots for same doctor at same time
slotSchema.index({ doctorId: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model('Slot', slotSchema);
