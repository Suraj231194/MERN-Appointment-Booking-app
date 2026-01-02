const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Slot = require('./models/Slot');
const Appointment = require('./models/Appointment');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        console.log('🧹 Clearing Database...');
        await User.deleteMany({});
        await Doctor.deleteMany({});
        await Slot.deleteMany({});
        await Appointment.deleteMany({});

        console.log('🌱 Creating Users & Doctors...');

        // 1. Create Admin
        await User.create({
            name: 'Super Admin',
            email: 'admin@hospital.com',
            password: 'password123',
            role: 'admin'
        });

        // 2. Create 10 Doctors
        const doctors = [];
        for (let i = 1; i <= 10; i++) {
            const user = await User.create({
                name: `Dr. Gregory House ${i}`,
                email: `doctor${i}@hospital.com`,
                password: 'password123',
                role: 'doctor'
            });

            const doctor = await Doctor.create({
                user: user._id,
                specialty: ['Cardiology', 'Neurology', 'Dermatology', 'Pediatrics', 'Orthopedics'][i % 5],
                experience: i + 2,
                workingHours: { start: '09:00', end: '17:00' }
            });
            doctors.push(doctor);
        }

        // 3. Create 10 Patients
        const patients = [];
        for (let i = 1; i <= 10; i++) {
            const user = await User.create({
                name: `Patient Zero ${i}`,
                email: `patient${i}@hospital.com`,
                password: 'password123',
                role: 'patient'
            });
            patients.push(user);
        }

        console.log('📅 Generating Slots...');
        const allSlots = [];
        const date = new Date().toISOString().split('T')[0]; // Today

        for (const doc of doctors) {
            // Generate slots for today 09:00 - 17:00
            const [startHour] = doc.workingHours.start.split(':').map(Number);
            const [endHour] = doc.workingHours.end.split(':').map(Number);

            const selectedDate = new Date(date);
            let currentTime = new Date(selectedDate.setHours(startHour, 0, 0, 0));
            const endTime = new Date(selectedDate.setHours(endHour, 0, 0, 0));

            while (currentTime < endTime) {
                const nextTime = new Date(currentTime.getTime() + 30 * 60000); // 30 min slots
                if (nextTime > endTime) break;

                allSlots.push({
                    doctorId: doc._id,
                    startTime: new Date(currentTime),
                    endTime: new Date(nextTime),
                    status: 'AVAILABLE'
                });
                currentTime = nextTime;
            }
        }

        const createdSlots = await Slot.insertMany(allSlots);
        console.log(`   Created ${createdSlots.length} slots.`);

        console.log('🤝 Booking 20 Appointments...');
        // Randomly book 20 slots
        const shuffledSlots = createdSlots.sort(() => 0.5 - Math.random());
        const selectedSlots = shuffledSlots.slice(0, 20);

        for (let i = 0; i < 20; i++) {
            const slot = selectedSlots[i];
            const patient = patients[i % patients.length]; // Recycle patients

            // Mark slot as booked
            slot.status = 'BOOKED';
            await slot.save();

            await Appointment.create({
                patientId: patient._id,
                doctorId: slot.doctorId,
                slotId: slot._id,
                status: 'CONFIRMED',
                notes: `Seed appointment number ${i + 1}`
            });
        }

        console.log('✅ Seeding Complete!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
