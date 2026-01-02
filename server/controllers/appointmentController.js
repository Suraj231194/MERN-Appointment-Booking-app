const mongoose = require('mongoose');
const Slot = require('../models/Slot');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Generate Slots for a Doctor
exports.generateSlots = async (req, res, next) => {
    try {
        let { doctorId, date, duration } = req.body;

        if (req.user.role === 'doctor' && !doctorId) {
            const doc = await Doctor.findOne({ user: req.user.id });
            if (!doc) return res.status(404).json({ message: 'Doctor profile not found' });
            doctorId = doc._id;
        }

        if (!doctorId) return res.status(400).json({ message: 'Doctor ID required' });

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        const [startHour, startMin] = doctor.workingHours.start.split(':').map(Number);
        const [endHour, endMin] = doctor.workingHours.end.split(':').map(Number);

        const selectedDate = new Date(date);
        let currentTime = new Date(selectedDate.setHours(startHour, startMin, 0, 0));
        const endTime = new Date(selectedDate.setHours(endHour, endMin, 0, 0));

        const slotsToCreate = [];

        while (currentTime < endTime) {
            const nextTime = new Date(currentTime.getTime() + duration * 60000);
            if (nextTime > endTime) break;

            slotsToCreate.push({
                doctorId,
                startTime: new Date(currentTime),
                endTime: new Date(nextTime),
                status: 'AVAILABLE'
            });

            currentTime = nextTime;
        }

        try {
            await Slot.insertMany(slotsToCreate, { ordered: false });
        } catch (error) {
            if (error.code !== 11000) throw error;
        }

        res.status(201).json({ success: true, count: slotsToCreate.length, message: 'Slots generated' });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Available Slots
exports.getSlots = async (req, res, next) => {
    try {
        const { date } = req.query;
        const { doctorId } = req.params;

        let query = { doctorId, status: 'AVAILABLE' };

        if (date) {
            const startOfDay = new Date(date);
            if (isNaN(startOfDay.getTime())) return res.status(400).json({ message: 'Invalid date' });

            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            query.startTime = { $gte: startOfDay, $lte: endOfDay };
        }

        const slots = await Slot.find(query).sort({ startTime: 1 });

        res.status(200).json({ success: true, count: slots.length, data: slots });
    } catch (err) {
        next(err);
    }
};

// @desc    Book Appointment (ATOMIC - Standalone Safe)
exports.bookAppointment = async (req, res, next) => {
    try {
        const { slotId, notes } = req.body;
        const patientId = req.user.id;

        const slotCheck = await Slot.findById(slotId);
        if (!slotCheck) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        const startOfDay = new Date(slotCheck.startTime);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(slotCheck.startTime);
        endOfDay.setHours(23, 59, 59, 999);

        const existingAppt = await Appointment.findOne({
            patientId,
            doctorId: slotCheck.doctorId,
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'CANCELLED' }
        });

        if (existingAppt) {
            return res.status(400).json({ message: 'You already have an appointment with this doctor on this date.' });
        }

        // Atomic Update
        const slot = await Slot.findOneAndUpdate(
            { _id: slotId, status: 'AVAILABLE' },
            { status: 'BOOKED' },
            { new: true }
        );

        if (!slot) {
            return res.status(400).json({ success: false, message: 'Slot is already booked or unavailable' });
        }

        // Create Appointment with Revert logic
        let appointment;
        try {
            appointment = await Appointment.create({
                patientId,
                doctorId: slot.doctorId,
                slotId,
                status: 'CONFIRMED',
                notes
            });
        } catch (createError) {
            await Slot.findByIdAndUpdate(slotId, { status: 'AVAILABLE' });
            throw createError;
        }

        res.status(200).json({ success: true, data: appointment });

    } catch (err) {
        next(err);
    }
};

exports.getMyAppointments = async (req, res, next) => {
    try {
        let query = {};
        if (req.user.role === 'patient') {
            query.patientId = req.user.id;
        } else if (req.user.role === 'doctor') {
            const doctor = await Doctor.findOne({ user: req.user.id });
            if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
            query.doctorId = doctor._id;
        }

        const appointments = await Appointment.find(query)
            .populate('slotId')
            .populate({ path: 'doctorId', populate: { path: 'user', select: 'name' } })
            .populate('patientId', 'name email');

        res.status(200).json({ success: true, count: appointments.length, data: appointments });
    } catch (err) {
        next(err);
    }
};

// Get All Doctors
exports.getAllDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find({ isActive: true }).populate('user', 'name email');
        res.status(200).json({ success: true, count: doctors.length, data: doctors });
    } catch (err) {
        next(err);
    }
};

// @desc    Cancel Appointment
exports.cancelAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Populate slotId to access its _id inside if block? 
        // Actually appointment.slotId is usually an ID in simple find, but if populate used, it's object.
        // Let's populate to be safe and access _id.
        const appointment = await Appointment.findById(id).populate('slotId');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        let authorized = false;
        if (req.user.role === 'admin') authorized = true;

        // Patient can cancel their own
        if (req.user.role === 'patient' && appointment.patientId.toString() === req.user.id) {
            authorized = true;
        }

        // Doctor can cancel if it matches their profile
        if (req.user.role === 'doctor') {
            const docProfile = await Doctor.findOne({ user: req.user.id });
            if (docProfile && docProfile._id.toString() === appointment.doctorId.toString()) {
                authorized = true;
            }
        }

        if (!authorized) {
            return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
        }

        appointment.status = 'CANCELLED';
        await appointment.save();

        if (appointment.slotId) {
            // If populated, use ._id, else use straight
            const slotId = appointment.slotId._id || appointment.slotId;
            const slot = await Slot.findById(slotId);
            if (slot) {
                slot.status = 'AVAILABLE';
                await slot.save();
            }
        }

        res.status(200).json({ success: true, data: appointment });
    } catch (err) {
        next(err);
    }
};

// @desc    Get All Appointments (Admin)
exports.getAllAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find({})
            .populate('slotId')
            .populate({ path: 'doctorId', populate: { path: 'user', select: 'name' } })
            .populate('patientId', 'name email');

        res.status(200).json({ success: true, count: appointments.length, data: appointments });
    } catch (err) {
        next(err);
    }
};

// @desc    Update Appointment (Admin)
exports.adminUpdateAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, notes, newSlotId } = req.body;

        const appointment = await Appointment.findById(id).populate('slotId');
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Handle Rescheduling
        if (newSlotId && newSlotId !== appointment.slotId._id.toString()) {
            // 1. Verify New Slot
            const newSlot = await Slot.findOne({ _id: newSlotId, status: 'AVAILABLE' });
            if (!newSlot) {
                return res.status(400).json({ message: 'Selected slot is not available' });
            }

            // 2. Book New Slot
            newSlot.status = 'BOOKED';
            await newSlot.save();

            // 3. Free Old Slot
            if (appointment.slotId) {
                const oldSlotId = appointment.slotId._id || appointment.slotId;
                await Slot.findByIdAndUpdate(oldSlotId, { status: 'AVAILABLE' });
            }

            // 4. Update Appointment
            appointment.slotId = newSlotId;
            // Ensure status is CONFIRMED if it was something else, unless specifically setting to other
            if (!status) appointment.status = 'CONFIRMED';
        }

        if (status === 'CANCELLED' && appointment.status !== 'CANCELLED') {
            if (appointment.slotId) {
                // Determine slot ID safely whether we just rescheduled or not (though if rescheduled, old is already freed)
                // If we rescheduled, appointment.slotId is now newSlotId (which is an ID string, not object yet unless refreshed, but we assigned ID above)
                // However, Mongoose document assignment: appointment.slotId = newSlotId.
                // If we cancel immediately after reschedule (unlikely but possible request), we need to free the CURRENT slot.
                const currentSlotId = appointment.slotId._id || appointment.slotId;
                await Slot.findByIdAndUpdate(currentSlotId, { status: 'AVAILABLE' });
            }
        }

        if (status) appointment.status = status;
        if (notes) appointment.notes = notes;

        await appointment.save();

        res.status(200).json({ success: true, data: appointment });
    } catch (err) {
        next(err);
    }
};

// @desc    Create Appointment (Admin)
exports.adminCreateAppointment = async (req, res, next) => {
    try {
        const { doctorId, slotId, patientId, notes } = req.body;

        const slot = await Slot.findById(slotId);
        if (!slot) return res.status(404).json({ message: 'Slot not found' });
        if (slot.status !== 'AVAILABLE') return res.status(400).json({ message: 'Slot is not available' });

        slot.status = 'BOOKED';
        await slot.save();

        const appointment = await Appointment.create({
            patientId,
            doctorId,
            slotId,
            status: 'CONFIRMED',
            notes
        });

        res.status(201).json({ success: true, data: appointment });

    } catch (err) {
        next(err);
    }
};
