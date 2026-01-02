import { X, Calendar, Clock, User, Phone, Mail, FileText } from 'lucide-react';
import { format } from 'date-fns';

const AppointmentDetailsModal = ({ isOpen, onClose, appointment }) => {
    if (!isOpen || !appointment) return null;

    const { patientId, slotId, status, notes } = appointment;
    const date = new Date(slotId.startTime);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Appointment Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Patient Info */}
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-xl flex-shrink-0">
                            {patientId?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{patientId?.name || 'Unknown Patient'}</h4>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Patient ID: {patientId?._id || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
                            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                                <Calendar size={16} className="mr-2 text-teal-500" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Date</span>
                            </div>
                            <p className="font-medium text-gray-900 dark:text-white">{format(date, 'PPP')}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
                            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                                <Clock size={16} className="mr-2 text-teal-500" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Time</span>
                            </div>
                            <p className="font-medium text-gray-900 dark:text-white">{format(date, 'p')}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <Mail size={18} className="text-gray-400 dark:text-gray-500 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{patientId?.email || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <Phone size={18} className="text-gray-400 dark:text-gray-500 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Contact Number</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {notes?.match(/Contact Number: (.*)/)?.[1] || 'Not provided'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <FileText size={18} className="text-gray-400 dark:text-gray-500 mr-3 mt-1" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Notes</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
                                    {notes || 'No additional notes'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                             ${status === 'CONFIRMED' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                status === 'CANCELLED' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            }
                        `}>
                            Status: {status}
                        </span>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetailsModal;
