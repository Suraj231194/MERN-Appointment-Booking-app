const mongoose = require('mongoose');
const User = require('./server/models/User');
const Doctor = require('./server/models/Doctor');
const Slot = require('./server/models/Slot');
const Appointment = require('./server/models/Appointment');

const DB_URI = "mongodb+srv://suraj:suraj@cluster0.2v6j1.mongodb.net/appointment-booking?retryWrites=true&w=majority";

const seed = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('DB Connected');

        // Find Doctor
        let doctorUser = await User.findOne({ role: 'doctor' });
        if (!doctorUser) {
            console.log('No doctor user found, creating one...');
            // ... create logic if needed, but assuming exists
            return;
        }
        let doctor = await Doctor.findOne({ user: doctorUser._id });
        if (!doctor) {
            console.log('Doctor profile not found');
            return;
        }

        // Find Patient
        const patient = await User.findOne({ role: 'patient' });
        if (!patient) {
            console.log('No patient found');
            return;
        }

        console.log(`Doctor: ${doctorUser.name}, Patient: ${patient.name}`);

        // Dates: Today, Tomorrow, +5 days
        const dates = [0, 1, 5];

        for (let offset of dates) {
            const date = new Date();
            date.setDate(date.getDate() + offset);
            date.setHours(10, 0, 0, 0); // 10:00 AM

            // Create Slot
            const endTime = new Date(date);
            endTime.setMinutes(endTime.getMinutes() + 30);

            // Check if slot exists
            let slot = await Slot.findOne({ doctorId: doctor._id, startTime: date });
            if (!slot) {
                slot = await Slot.create({
                    doctorId: doctor._id,
                    startTime: date,
                    endTime: endTime,
                    status: 'BOOKED' // Directly mark booked
                });
                console.log(`Created Slot for ${date.toISOString()}`);
            } else {
                console.log(`Slot exists for ${date.toISOString()}`);
                slot.status = 'BOOKED';
                await slot.save();
            }

            // Create Appointment
            const apptQuery = { slotId: slot._id, patientId: patient._id };
            let appt = await Appointment.findOne(apptQuery);

            if (!appt) {
                appt = await Appointment.create({
                    patientId: patient._id,
                    doctorId: doctor._id,
                    slotId: slot._id,
                    date: date,
                    status: 'CONFIRMED',
                    notes: 'Seeded appointment for testing'
                });
                console.log(`Created Appointment for ${date.toISOString()}`);
            } else {
                console.log(`Appointment exists for ${date.toISOString()}`);
            }
        }

        console.log('Seeding Complete');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
