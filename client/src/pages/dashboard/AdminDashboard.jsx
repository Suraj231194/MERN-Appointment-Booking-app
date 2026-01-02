import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { format } from 'date-fns';
import { Search, Filter, Edit2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminAppointmentModal from '../../components/AdminAppointmentModal';

const AdminDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        // Filter logic
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = appointments.filter(appt =>
            appt.patientId?.name?.toLowerCase().includes(lowerTerm) ||
            appt.doctorId?.user?.name?.toLowerCase().includes(lowerTerm) ||
            appt.status.toLowerCase().includes(lowerTerm)
        );
        setFilteredAppointments(filtered);
    }, [searchTerm, appointments]);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get('/appointments/all');
            const data = res.data.data;
            setAppointments(data);

            // Calculate Stats
            const statsCount = data.reduce((acc, curr) => {
                acc.total++;
                acc[curr.status.toLowerCase()] = (acc[curr.status.toLowerCase()] || 0) + 1;
                return acc;
            }, { total: 0, pending: 0, confirmed: 0, cancelled: 0 });
            setStats(statsCount);

        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch appointments');
        }
    };

    const handleEditClick = (appt) => {
        setSelectedAppointment(appt);
        setIsEditModalOpen(true);
    };

    const handleUpdateAppointment = async (id, data) => {
        try {
            await axios.put(`/appointments/${id}`, data);
            toast.success('Appointment updated successfully');
            fetchAppointments();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header & Stats */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Systems</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Appointments</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-yellow-400">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</p>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-400">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confirmed</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">{stats.confirmed}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-red-400">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cancelled</p>
                        <p className="text-3xl font-bold text-red-600 mt-2">{stats.cancelled}</p>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search patients, doctors, or status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Placeholder for 'Create Appointment' button if prioritizing it */}
                    {/* <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                        <Plus size={20} className="mr-2" />
                        New Appointment
                    </button> */}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAppointments.map((appt) => (
                                <tr key={appt._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{appt.patientId?.name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">{appt.patientId?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">Dr. {appt.doctorId?.user?.name || 'Unknown'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{format(new Date(appt.slotId.startTime), 'MMM dd, yyyy')}</div>
                                        <div className="text-xs text-gray-500">{format(new Date(appt.slotId.startTime), 'HH:mm')}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                appt.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                    appt.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {appt.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditClick(appt)}
                                            className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredAppointments.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        No appointments found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AdminAppointmentModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                appointment={selectedAppointment}
                onUpdate={handleUpdateAppointment}
            />
        </div>
    );
};

export default AdminDashboard;
