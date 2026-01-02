const express = require('express');
const { generateSlots, getSlots, bookAppointment, getMyAppointments, getAllDoctors, cancelAppointment } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Slots
router.post('/slots', protect, authorize('admin', 'doctor'), generateSlots);
router.get('/slots/:doctorId', getSlots);

// Doctors
router.get('/doctors', getAllDoctors);

// Appointments
router.post('/book', protect, authorize('patient'), bookAppointment);
router.get('/my', protect, getMyAppointments);
router.put('/cancel/:id', protect, cancelAppointment);

module.exports = router;
