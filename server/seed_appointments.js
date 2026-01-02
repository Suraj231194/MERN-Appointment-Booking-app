const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Slot = require('./models/Slot');
const Appointment = require('./models/Appointment');

const DB_URI = "mongodb://localhost:27017/appointment-booking";

const seed = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('DB Connected');

        // Find Doctor
        let doctorUser = await User.findOne({ role: 'doctor' });
        if (!doctorUser) {
            console.log('No doctor user found');
            process.exit(0);
        }
        let doctor = await Doctor.findOne({ user: doctorUser._id });
        if (!doctor) {
            console.log('Doctor profile not found');
            process.exit(0);
        }

        // Find Patient (TARGET SPECIFIC USER)
        const targetEmail = 'test@example.com';
        let patient = await User.findOne({ email: targetEmail });

        if (!patient) {
            console.log(`Patient ${targetEmail} not found, finding any patient...`);
            patient = await User.findOne({ role: 'patient' });
        }

        if (!patient) {
            console.log('No patient found');
            process.exit(0);
        }

        console.log(`Doctor: ${doctorUser.name}, Patient: ${patient.name} (${patient.email})`);

        // Dates: Today, Tomorrow, +5 days
        const dates = [0, 1, 5];

        for (let offset of dates) {
            const date = new Date();
            date.setDate(date.getDate() + offset);
            date.setHours(11, 0, 0, 0); // 11:00 AM (Different time to avoid conflict with previous seed)

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
                    status: 'BOOKED'
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
                // Check if ANY appointment exists for this slot (to avoid duplicate key error)
                const existingAppt = await Appointment.findOne({ slotId: slot._id });
                if (existingAppt) {
                    console.log(`Slot ${slot._id} already booked by another patient.`);
                    // Ideally we should find another slot, but for test we skip
                } else {
                    appt = await Appointment.create({
                        patientId: patient._id,
                        doctorId: doctor._id,
                        slotId: slot._id,
                        date: date,
                        status: 'CONFIRMED',
                        notes: 'Seeded appointment for Test User'
                    });
                    console.log(`Created Appointment for ${date.toISOString()}`);
                }
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
