const express = require('express');
const { generateSlots, getSlots, bookAppointment, getMyAppointments, getAllDoctors, cancelAppointment, getAllAppointments, adminUpdateAppointment, adminCreateAppointment } = require('../controllers/appointmentController');
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

// Admin Routes
router.get('/all', protect, authorize('admin'), getAllAppointments);
router.put('/:id', protect, authorize('admin'), adminUpdateAppointment);
router.post('/admin/book', protect, authorize('admin'), adminCreateAppointment);

module.exports = router;
