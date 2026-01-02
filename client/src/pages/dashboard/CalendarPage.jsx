import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, User, Stethoscope, Calendar as CalendarIcon, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDateAppointments, setSelectedDateAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAppointments();
        fetchUpcomingAppointments();
    }, []);

    // Effect to filter appointments when selected date changes
    useEffect(() => {
        const dailyAppts = appointments.filter(appt =>
            isSameDay(new Date(appt.slotId.startTime), selectedDate)
        );
        setSelectedDateAppointments(dailyAppts);
    }, [selectedDate, appointments]);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/appointments/my');
            setAppointments(res.data.data);
        } catch (err) {
            console.error(err);
            // toast.error('Failed to load schedule'); 
        } finally {
            setLoading(false);
        }
    };

    const fetchUpcomingAppointments = async () => {
        try {
            const res = await axios.get('/appointments/my?scope=upcoming');
            setUpcomingAppointments(res.data.data);
        } catch (err) {
            console.error('Failed to load upcoming appointments', err);
        }
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const renderHeader = () => {
        return (
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Calendar</h2>
                    <p className="text-gray-500 text-sm dark:text-gray-400">Manage appointments and schedules</p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 self-start md:self-auto">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors hover:text-teal-600 dark:hover:text-teal-400">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-bold text-gray-800 dark:text-white min-w-[120px] text-center uppercase tracking-wide">
                        {format(currentDate, 'MMMM yyyy')}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-colors hover:text-teal-600 dark:hover:text-teal-400">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="grid grid-cols-7 mb-2">
                {days.map(day => (
                    <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase py-2">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const days = [];
        const dayList = eachDayOfInterval({ start: startDate, end: endDate });

        dayList.forEach((dayItem) => {
            const dayAppts = appointments.filter(appt =>
                isSameDay(new Date(appt.slotId.startTime), dayItem)
            );
            const isSelected = isSameDay(dayItem, selectedDate);
            const isCurrentMonth = isSameMonth(dayItem, monthStart);

            days.push(
                <div
                    key={dayItem.toString()}
                    className={`
                        min-h-[100px] border border-gray-50 dark:border-gray-700 p-2 relative cursor-pointer transition-all group hover:z-10 bg-white dark:bg-gray-800
                        ${!isCurrentMonth ? "bg-gray-50/50 dark:bg-gray-900/50 text-gray-300 dark:text-gray-600" : "dark:text-gray-200"}
                        ${isSelected ? "ring-2 ring-teal-500 z-10 shadow-lg" : "hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600"}
                        ${isSameDay(dayItem, new Date()) ? "bg-teal-50/30 dark:bg-teal-900/20" : ""}
                    `}
                    onClick={() => setSelectedDate(dayItem)}
                >
                    <div className="flex justify-between items-start">
                        <span className={`text-sm font-medium ${isSameDay(dayItem, new Date()) ? 'bg-teal-500 text-white w-6 h-6 flex items-center justify-center rounded-full' : ''}`}>
                            {format(dayItem, 'd')}
                        </span>
                        {dayAppts.length > 0 && (
                            <span className="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                {dayAppts.length}
                            </span>
                        )}
                    </div>
                    <div className="mt-2 space-y-1">
                        {dayAppts.slice(0, 2).map((appt, i) => (
                            <div key={i} className="text-[10px] bg-teal-50/80 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 p-1 rounded truncate border border-teal-100 dark:border-teal-800/30">
                                {format(new Date(appt.slotId.startTime), 'HH:mm')} - {appt.doctorName || 'Dr. Visit'}
                            </div>
                        ))}
                        {dayAppts.length > 2 && (
                            <div className="text-[10px] text-gray-400 pl-1">
                                +{dayAppts.length - 2} more
                            </div>
                        )}
                    </div>
                </div>
            );
        });

        return <div className="grid grid-cols-7 gap-1 md:gap-2">{days}</div>;
    };

    return (
        <div className="p-6">
            {renderHeader()}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    {/* Main Calendar Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-xl">
                        {renderDays()}
                        {renderCells()}
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    {/* Selected Day Panel */}
                    <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div className="flex items-center gap-3">
                                <CalendarIcon className="text-teal-400" size={20} />
                                <span className="font-semibold">{format(selectedDate, 'MMM do, yyyy')}</span>
                            </div>
                            <button className="p-2 bg-teal-500 hover:bg-teal-400 rounded-lg transition-colors text-white shadow-lg shadow-teal-500/20">
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="space-y-4 relative z-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {selectedDateAppointments.length > 0 ? (
                                selectedDateAppointments.map((appt) => (
                                    <div key={appt._id} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-teal-500/50 transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2 text-teal-400 font-medium">
                                                <Clock size={14} />
                                                <span>
                                                    {format(new Date(appt.slotId.startTime), 'HH:mm')} - {format(new Date(appt.slotId.endTime), 'HH:mm')}
                                                </span>
                                            </div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${appt.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {appt.status}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold mb-1 group-hover:text-teal-400 transition-colors">
                                            {appt.doctorId?.user?.name || 'Doctor Appointment'}
                                        </h4>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Stethoscope size={14} />
                                            <span>General Checkup</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-600">
                                        <Clock size={20} />
                                    </div>
                                    <p className="text-gray-400 text-sm">No appointments scheduled</p>
                                    <button className="text-teal-400 text-xs font-semibold mt-2 hover:underline">
                                        Schedule one now
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Upcoming Appointments (Next 10 Days) */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 dark:text-white">Next 10 Days</h3>
                            <span className="text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-2 py-1 rounded-full font-medium">
                                {upcomingAppointments.length} Upcoming
                            </span>
                        </div>

                        <div className="space-y-3">
                            {upcomingAppointments.length > 0 ? (
                                upcomingAppointments.map((appt) => (
                                    <div key={appt._id} className="group flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                        <div className="flex-shrink-0 w-12 h-12 bg-teal-50 dark:bg-teal-900/20 rounded-lg flex flex-col items-center justify-center text-teal-600 dark:text-teal-400 font-bold border border-teal-100 dark:border-teal-800/30">
                                            <span className="text-xs uppercase">{format(new Date(appt.slotId.startTime), 'MMM')}</span>
                                            <span className="text-lg leading-none">{format(new Date(appt.slotId.startTime), 'd')}</span>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-semibold text-gray-800 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                {appt.doctorId?.user?.name || 'Doctor Appointment'}
                                            </h4>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {format(new Date(appt.slotId.startTime), 'HH:mm')}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User size={12} />
                                                    {appt.patientId?.name || 'Patient'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                    No upcoming appointments found.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
