const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runTest = async () => {
    try {
        console.log('🚀 Starting Full Verification Test...');

        // 1. Create a Doctor
        const docEmail = `doc${Date.now()}@hospital.com`;
        console.log(`1. Registering Doctor (${docEmail})...`);
        const docRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Dr. House',
            email: docEmail,
            password: 'password123',
            role: 'doctor',
            specialty: 'Diagnostic Medicine',
            workingHours: { start: '09:00', end: '17:00' }
        });
        const docToken = docRes.data.token;
        const doctorId = docRes.data.user.id; // This is User ID, need Doctor ID potentially?
        // Wait, generateSlots logic fixes looking up Doctor ID from User ID now.
        console.log('   ✅ Doctor Registered.');

        // 2. Generate Slots
        console.log('2. Generating Slots for Today...');
        const date = new Date().toISOString().split('T')[0];
        await axios.post(`${API_URL}/appointments/slots`, {
            date: date,
            duration: 30
        }, {
            headers: { Authorization: `Bearer ${docToken}` }
        });
        console.log('   ✅ Slots Generated.');

        // 3. Find a target slot
        // We need the ACTUAL Doctor ID for the query, or we can use the "get doctors" endpoint to find it
        // because "doctorId" variable above is likely the User ID (from auth response).
        // Let's get the doctor list to be sure.
        const allDocs = await axios.get(`${API_URL}/appointments/doctors`);
        const targetDoctor = allDocs.data.data.find(d => d.user._id === doctorId || d.user.id === doctorId); // match user id

        if (!targetDoctor) {
            throw new Error('Could not find doctor profile after registration');
        }

        const slotsRes = await axios.get(`${API_URL}/appointments/slots/${targetDoctor._id}?date=${date}`);
        const slots = slotsRes.data.data;
        if (slots.length === 0) throw new Error('No slots returned');

        const targetSlotId = slots[0]._id;
        console.log(`   🎯 Target Slot: ${targetSlotId} (${slots[0].startTime})`);

        // 4. Register 5 Patients
        console.log('3. Registering 5 Patients...');
        const patientTokens = [];
        for (let i = 0; i < 5; i++) {
            const pRes = await axios.post(`${API_URL}/auth/register`, {
                name: `Patient ${i}`,
                email: `patient${Date.now()}_${i}@test.com`,
                password: 'password123',
                role: 'patient'
            });
            patientTokens.push(pRes.data.token);
        }
        console.log('   ✅ Patients Ready.');

        // 5. ATTACK!
        console.log('4. ⚡ EXECUTING CONCURRENT BOOKING ATTACK (5 Requests)...');
        const attempts = patientTokens.map((token, index) => {
            return axios.post(
                `${API_URL}/appointments/book`,
                { slotId: targetSlotId }, // Body only needs slotId now? No, let's check bookAppointment controller.
                // It needs: { slotId } (and infers patient from token). 
                // Wait, bookAppointment controller also takes doctorId? 
                // "const { slotId } = req.body;" -> Yes, only slotId is used for the atomic update!
                // "const { slotId, doctorId } = req.body;" was in the first version, but I updated it.
                // Let's check the current file content... I think I removed doctorId from body requirement?
                // Step 85: "const { slotId } = req.body;" YES.
                { headers: { Authorization: `Bearer ${token}` } }
            )
                .then(res => ({ status: 'success', index, data: res.data }))
                .catch(err => ({ status: 'failed', index, error: err.response?.data?.message }));
        });

        const results = await Promise.all(attempts);

        const successes = results.filter(r => r.status === 'success');
        const failures = results.filter(r => r.status === 'failed');

        console.log('\n================================');
        console.log(`RESULTS: ${successes.length} Success / ${failures.length} Failures`);
        console.log('================================');

        if (successes.length === 1 && failures.length === 4) {
            console.log('✅ PASS: Atomic Locking worked.');
        } else {
            console.log('❌ FAIL: Weird outcome.');
            console.log('Failure Reasons:', failures.map(f => f.error));
        }

    } catch (err) {
        console.error('❌ FATAL ERROR:', err.response?.data || err.message);
    }
};

runTest();
