import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const AdminAppointmentModal = ({ isOpen, onClose, appointment, onUpdate }) => {
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (appointment) {
            setStatus(appointment.status);
            setNotes(appointment.notes || '');
        }
    }, [appointment]);

    if (!isOpen || !appointment) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onUpdate(appointment._id, { status, notes });
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-fade-in overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800">Edit Appointment</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Info Card */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-xs font-semibold text-blue-600 uppercase">Patient</span>
                            <span className="text-xs font-semibold text-blue-600 uppercase">Doctor</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="font-bold text-gray-800">{appointment.patientId?.name || 'Unknown'}</p>
                            <p className="font-bold text-gray-800">Dr. {appointment.doctorId?.user?.name || 'Unknown'}</p>
                        </div>
                        <div className="pt-2 border-t border-blue-100 flex justify-between">
                            <span className="text-sm text-blue-800">
                                {format(new Date(appointment.slotId.startTime), 'PPP')}
                            </span>
                            <span className="text-sm text-blue-800 font-mono">
                                {format(new Date(appointment.slotId.startTime), 'HH:mm')}
                            </span>
                        </div>
                    </div>

                    {/* Status Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                        {status === 'CANCELLED' && (
                            <p className="flex items-center text-xs text-red-500 mt-2">
                                <AlertCircle size={14} className="mr-1" />
                                Setting to CANCELLED will free up the slot automatically.
                            </p>
                        )}
                    </div>

                    {/* Notes Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes & Contact Info</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            placeholder="Add internal notes or update contact number..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-70"
                        >
                            <Save size={18} className="mr-2" />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAppointmentModal;
