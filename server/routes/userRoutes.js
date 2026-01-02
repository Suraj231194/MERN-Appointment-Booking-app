const express = require('express');
const { getAllDoctors, getAllPatients } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // Protect all routes

router.get('/doctors', getAllDoctors);
router.get('/patients', authorize('admin', 'doctor'), getAllPatients);

module.exports = router;
