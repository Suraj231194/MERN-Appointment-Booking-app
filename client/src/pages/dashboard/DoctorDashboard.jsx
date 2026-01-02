import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import AppointmentDetailsModal from '../../components/AppointmentDetailsModal';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get('/appointments/my');
            setAppointments(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const generateDailySlots = async () => {
        setIsLoading(true);
        try {
            await axios.post('/appointments/slots', {
                date: new Date().toISOString(),
                duration: 30
            });
            toast.success('Slots generated for today!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to generate slots');
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewAppointment = (appt) => {
        setSelectedAppointment(appt);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Doctor Dashboard</h2>
                    <p className="text-gray-500 text-sm dark:text-gray-400">Manage your schedule and patients</p>
                </div>
                <button
                    onClick={generateDailySlots}
                    disabled={isLoading}
                    className={`
                        inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                        ${isLoading ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'} 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors
                    `}
                >
                    {isLoading ? 'Generating...' : '+ Generate Daily Slots'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">Today's Appointments</h3>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                        {appointments.length}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Appointments</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Patient</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {appointments.map((appt) => (
                                <tr key={appt._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-xs">
                                                {appt.patientId?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{appt.patientId?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{appt.patientId?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">{format(new Date(appt.slotId.startTime), 'MMM dd')}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(appt.slotId.startTime), 'HH:mm')}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                            appt.status === 'CANCELLED' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                            }`}>
                                            {appt.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => handleViewAppointment(appt)}
                                            className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-300 font-medium"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500 text-sm dark:text-gray-400">
                                        No appointments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AppointmentDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                appointment={selectedAppointment}
            />
        </div>
    );
};

export default DoctorDashboard;
