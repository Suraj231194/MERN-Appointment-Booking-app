import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import BookingConfirmationModal from '../../components/BookingConfirmationModal';

const PatientDashboard = () => {
    const { user } = useAuthStore();
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [slots, setSlots] = useState([]);
    const [myAppointments, setMyAppointments] = useState([]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        fetchDoctors();
        fetchMyAppointments();
    }, []);

    useEffect(() => {
        if (selectedDoctor) {
            fetchSlots();
        }
    }, [selectedDoctor, selectedDate]);

    const fetchDoctors = async () => {
        try {
            const res = await axios.get('/appointments/doctors');
            setDoctors(res.data.data);
        } catch (err) {
            console.log('Error fetching doctors', err);
        }
    };

    const fetchSlots = async () => {
        try {
            const res = await axios.get(`/appointments/slots/${selectedDoctor._id}?date=${selectedDate}`);
            setSlots(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMyAppointments = async () => {
        try {
            const res = await axios.get('/appointments/my');
            setMyAppointments(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleConfirmBooking = async (formData) => {
        if (!selectedSlot) return;
        try {
            await axios.post('/appointments/book', {
                slotId: selectedSlot._id,
                notes: `Contact Number: ${formData.contactNumber}` // Saving contact in notes
            });
            toast.success('Appointment Booked!');
            setIsModalOpen(false);
            setSelectedSlot(null);
            fetchSlots();
            fetchMyAppointments();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
            fetchSlots();
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel?')) return;
        try {
            await axios.put(`/appointments/cancel/${id}`);
            toast.success('Appointment cancelled');
            fetchMyAppointments();
            fetchSlots();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Cancellation failed');
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">My Appointments</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                        {myAppointments.filter(a => a.status !== 'CANCELLED').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Next Appointment</h3>
                    <p className="text-xl font-bold text-blue-600 mt-2">
                        {myAppointments.filter(a => a.status !== 'CANCELLED')[0]
                            ? format(new Date(myAppointments.filter(a => a.status !== 'CANCELLED')[0].slotId.startTime), 'MMM dd, HH:mm')
                            : 'None'}
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Booking Section */}
                <div className="flex-1 min-w-[300px]">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Book an Appointment</h2>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
                            <select
                                onChange={(e) => setSelectedDoctor(doctors.find(d => d._id === e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            >
                                <option value="">-- Choose a Doctor --</option>
                                {doctors.map(doc => (
                                    <option key={doc._id} value={doc._id}>Dr. {doc.user.name} ({doc.specialty})</option>
                                ))}
                            </select>
                        </div>

                        {selectedDoctor && (
                            <div className="animate-fade-in">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={format(new Date(), 'yyyy-MM-dd')}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        )}

                        <div className="animate-fade-in">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Available Slots</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                                {slots.length === 0 && <p className="text-gray-400 text-sm col-span-3">No slots available</p>}
                                {slots.map(slot => (
                                    <button
                                        key={slot._id}
                                        onClick={() => {
                                            if (slot.status === 'AVAILABLE') {
                                                setSelectedSlot(slot);
                                                setIsModalOpen(true);
                                            }
                                        }}
                                        disabled={slot.status !== 'AVAILABLE'}
                                        className={`
                                                px-2 py-2 rounded-lg text-xs font-semibold transition-all
                                                ${slot.status === 'AVAILABLE'
                                                ? 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-100 cursor-pointer shadow-sm hover:shadow-md'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}
                                            `}
                                    >
                                        {format(new Date(slot.startTime), 'HH:mm')}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                <BookingConfirmationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmBooking}
                    doctorName={selectedDoctor?.user?.name}
                    slotTime={selectedSlot ? format(new Date(selectedSlot.startTime), 'PPP p') : ''}
                    userName={user?.name}
                    userEmail={user?.email}
                />

                {/* Schedule Section */}
                <div className="flex-1 min-w-[300px]">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">My Schedule</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                        {myAppointments.map(appt => (
                            <div key={appt._id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-900">Dr. {appt.doctorId?.user?.name || 'Unknown'}</p>
                                        <p className="text-sm text-gray-500 mt-1">{format(new Date(appt.slotId.startTime), 'PPP p')}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className={`
                                            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${appt.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
                                         `}>
                                            {appt.status}
                                        </span>
                                        {appt.status !== 'CANCELLED' && (
                                            <button
                                                onClick={() => handleCancel(appt._id)}
                                                className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium underline"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {myAppointments.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No booked appointments.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
