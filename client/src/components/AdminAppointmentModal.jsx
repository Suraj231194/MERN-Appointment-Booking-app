import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import axios from '../api/axios';

const AdminAppointmentModal = ({ isOpen, onClose, appointment, onUpdate }) => {
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    // Reschedule State
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [newSlotId, setNewSlotId] = useState(null);
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        if (appointment) {
            setStatus(appointment.status);
            setNotes(appointment.notes || '');
            setIsRescheduling(false);
            setNewSlotId(null);
            setSelectedDate('');
            setAvailableSlots([]);
        }
    }, [appointment]);

    useEffect(() => {
        if (isRescheduling && selectedDate && appointment?.doctorId) {
            fetchSlots();
        }
    }, [isRescheduling, selectedDate, appointment]);

    const fetchSlots = async () => {
        setLoadingSlots(true);
        try {
            // Handle both populated object and direct ID
            const doctorId = appointment.doctorId._id || appointment.doctorId;
            const res = await axios.get(`/appointments/slots/${doctorId}?date=${selectedDate}`);
            setAvailableSlots(res.data.data);
        } catch (err) {
            console.error('Failed to fetch slots', err);
        } finally {
            setLoadingSlots(false);
        }
    };

    if (!isOpen || !appointment) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const updateData = { status, notes };
        if (isRescheduling && newSlotId) {
            updateData.newSlotId = newSlotId;
        }
        await onUpdate(appointment._id, updateData);
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50 top-0 sticky z-10">
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

                    {/* Reschedule Section */}
                    <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium text-gray-700">Reschedule Time?</label>
                            <button
                                type="button"
                                onClick={() => setIsRescheduling(!isRescheduling)}
                                className={`text-sm font-medium ${isRescheduling ? 'text-red-500' : 'text-blue-600'}`}
                            >
                                {isRescheduling ? 'Cancel Reschedule' : 'Change Time'}
                            </button>
                        </div>

                        {isRescheduling && (
                            <div className="bg-gray-50 p-4 rounded-lg space-y-4 animate-fade-in">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Step 1: Pick Date</label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                {selectedDate && (
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Step 2: Pick New Slot</label>
                                        {loadingSlots ? (
                                            <p className="text-sm text-gray-500">Loading slots...</p>
                                        ) : availableSlots.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {availableSlots.map(slot => (
                                                    <button
                                                        key={slot._id}
                                                        type="button"
                                                        onClick={() => setNewSlotId(slot._id)}
                                                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${newSlotId === slot._id
                                                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                                                            }`}
                                                    >
                                                        {format(new Date(slot.startTime), 'HH:mm')}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-red-500">No slots available on this date.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Notes Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes & Contact Info</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
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
                            disabled={loading || (isRescheduling && !newSlotId)}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
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
