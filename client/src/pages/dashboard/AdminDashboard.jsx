import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { format } from 'date-fns';
import { Search, Filter, Edit2, MoreVertical, Smartphone, Calendar as CalendarIcon, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminAppointmentModal from '../../components/AdminAppointmentModal';
import AdminStats from '../../components/dashboard/AdminStats';
import AppointmentChart from '../../components/dashboard/AppointmentChart';
import StatusPieChart from '../../components/dashboard/StatusPieChart';

const AdminDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0, completed: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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
        setCurrentPage(1); // Reset page on filter
    }, [searchTerm, appointments]);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            }, { total: 0, pending: 0, confirmed: 0, cancelled: 0, completed: 0 });
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

    const upcomingAppointments = appointments
        .filter(a => ['CONFIRMED', 'PENDING'].includes(a.status) && new Date(a.slotId.startTime) > new Date())
        .sort((a, b) => new Date(a.slotId.startTime) - new Date(b.slotId.startTime))
        .slice(0, 5);

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Overview</h2>
                    <p className="text-gray-500 text-sm dark:text-gray-400">Monitor hospital performance and appointments</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
                        <CalendarIcon size={14} className="mr-2 text-teal-500" />
                        Today: {format(new Date(), 'MMM dd, yyyy')}
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            <AdminStats stats={stats} />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AppointmentChart data={appointments} />
                </div>
                <div className="lg:col-span-1">
                    <StatusPieChart stats={stats} />
                </div>
            </div>

            {/* Split View: Upcoming & Mobile Promo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upcoming List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Upcoming Schedule</h3>
                        <span className="text-xs font-semibold text-teal-600 bg-teal-50 dark:bg-teal-900/20 dark:text-teal-400 px-2 py-1 rounded">Next 5</span>
                    </div>
                    <div className="space-y-4">
                        {upcomingAppointments.length === 0 && <p className="text-gray-400 text-sm">No upcoming appointments.</p>}
                        {upcomingAppointments.map(appt => (
                            <div key={appt._id} className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
                                <div className="h-10 w-10 flex-shrink-0 bg-teal-100 dark:bg-teal-900/40 rounded-lg flex flex-col items-center justify-center text-teal-600 dark:text-teal-400">
                                    <span className="text-xs font-bold">{format(new Date(appt.slotId.startTime), 'dd')}</span>
                                    <span className="text-[10px] uppercase">{format(new Date(appt.slotId.startTime), 'MMM')}</span>
                                </div>
                                <div className="ml-4 flex-1">
                                    <h4 className="text-sm font-bold text-gray-800 dark:text-white">{appt.patientId?.name}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Dr. {appt.doctorId?.user?.name}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs font-bold text-gray-800 dark:text-gray-300">{format(new Date(appt.slotId.startTime), 'HH:mm')}</span>
                                    <span className={`text-[10px] font-medium 
                                        ${appt.status === 'PENDING' ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                                        {appt.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden flex flex-col justify-center">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Hospital Insights</h3>
                        <p className="text-teal-100 text-sm mb-6 max-w-xs">Track daily performance and patient satisfaction metrics directly from the admin console.</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                <p className="text-xs text-teal-100">Growth</p>
                                <p className="text-xl font-bold">+12%</p>
                            </div>
                            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                <p className="text-xs text-teal-100">Satisfaction</p>
                                <p className="text-xl font-bold">4.8/5</p>
                            </div>
                        </div>

                        <button className="w-full py-3 bg-white text-teal-700 font-bold rounded-lg hover:bg-teal-50 transition-colors shadow-md">
                            View Full Report
                        </button>
                    </div>
                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 rounded-full bg-white opacity-10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 rounded-full bg-white opacity-10 blur-2xl"></div>
                </div>
            </div>

            {/* Appointments Table Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">All Appointments</h3>
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs font-bold">{filteredAppointments.length}</span>
                    </div>

                    <div className="relative w-full sm:w-auto min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by patient, doctor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:focus:bg-gray-600 dark:text-white transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Doctor</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                            {currentItems.map((appt) => (
                                <tr key={appt._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                {appt.patientId?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-semibold text-gray-900 dark:text-white">{appt.patientId?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{appt.patientId?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-bold mr-2">
                                                Dr
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{appt.doctorId?.user?.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{format(new Date(appt.slotId.startTime), 'MMM dd, yyyy')}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded inline-block font-mono text-xs">
                                            {format(new Date(appt.slotId.startTime), 'HH:mm')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border 
                                            ${appt.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                                                appt.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' :
                                                    appt.status === 'COMPLETED' ? 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600' : 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'}`}>
                                            {appt.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditClick(appt)}
                                            className="text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 p-2 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredAppointments.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <Search size={48} className="text-gray-200 dark:text-gray-600 mb-4" />
                                            <p className="text-lg font-medium text-gray-900 dark:text-white">No appointments found</p>
                                            <p className="text-sm text-gray-400">Try adjusting your search terms</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {filteredAppointments.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-700">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredAppointments.length)}</span> of <span className="font-medium">{filteredAppointments.length}</span> results
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm text-gray-600 dark:text-gray-300"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm text-gray-600 dark:text-gray-300"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
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
