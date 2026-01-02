import { X, Calendar, Clock, User, Phone, Mail, FileText } from 'lucide-react';
import { format } from 'date-fns';

const AppointmentDetailsModal = ({ isOpen, onClose, appointment }) => {
    if (!isOpen || !appointment) return null;

    const { patientId, slotId, status, notes } = appointment;
    const date = new Date(slotId.startTime);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-fade-in overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800">Appointment Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Patient Info */}
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
                            {patientId?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-900">{patientId?.name || 'Unknown Patient'}</h4>
                            <p className="text-gray-500 text-sm">Patient ID: {patientId?._id || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center text-gray-500 mb-1">
                                <Calendar size={16} className="mr-2" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Date</span>
                            </div>
                            <p className="font-medium text-gray-900">{format(date, 'PPP')}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center text-gray-500 mb-1">
                                <Clock size={16} className="mr-2" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Time</span>
                            </div>
                            <p className="font-medium text-gray-900">{format(date, 'p')}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center p-3 border border-gray-100 rounded-lg">
                            <Mail size={18} className="text-gray-400 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500">Email Address</p>
                                <p className="text-sm font-medium text-gray-900">{patientId?.email || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 border border-gray-100 rounded-lg">
                            <Phone size={18} className="text-gray-400 mr-3" />
                            <div>
                                <p className="text-xs text-gray-500">Contact Number</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {notes?.match(/Contact Number: (.*)/)?.[1] || 'Not provided'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start p-3 border border-gray-100 rounded-lg">
                            <FileText size={18} className="text-gray-400 mr-3 mt-1" />
                            <div>
                                <p className="text-xs text-gray-500">Notes</p>
                                <p className="text-sm font-medium text-gray-900 break-words">
                                    {notes || 'No additional notes'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                             ${status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }
                        `}>
                            Status: {status}
                        </span>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
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
