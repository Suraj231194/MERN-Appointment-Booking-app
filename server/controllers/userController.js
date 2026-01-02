const User = require('../models/User');
const Doctor = require('../models/Doctor');

// @desc    Get all doctors
// @route   GET /api/users/doctors
// @access  Private
exports.getAllDoctors = async (req, res, next) => {
    try {
        // Fetch users with role 'doctor'
        // If you have a separate Doctor model linked, you might want that too
        // For the appointment form, we typically need the User ID and Name.
        // If your Doctor model has 'user' reference, we can populate.

        // Simple approach: Get Users who are doctors
        // const doctors = await User.find({ role: 'doctor' }).select('name email role');

        // Better approach if you use Doctor model:
        const doctors = await Doctor.find().populate('user', 'name email');

        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all patients
// @route   GET /api/users/patients
// @access  Private (Admin/Doctor)
exports.getAllPatients = async (req, res, next) => {
    try {
        const patients = await User.find({ role: 'patient' }).select('name email phone');

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (err) {
        next(err);
    }
};
