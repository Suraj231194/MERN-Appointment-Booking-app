import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Lock, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);

    // Mock Form State
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '+1 (555) 000-0000',
        role: user?.role || 'Patient',
        bio: 'Passionate about healthcare and wellness.',
        notifications: true,
        twoFactor: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success('Profile updated successfully');
        }, 1000);
    };

    return (
        <div className="animate-fade-in pb-12">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Account Settings</h2>
                <p className="text-gray-500 text-sm dark:text-gray-400">Manage your personal information and preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Identity Card */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-teal-600 to-emerald-600 relative">
                            <div className="absolute top-4 right-4 text-white/80 text-xs font-bold px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20">
                                {formData.role.toUpperCase()}
                            </div>
                        </div>
                        <div className="px-6 pb-6 text-center">
                            <div className="relative -mt-16 inline-block">
                                <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500 shadow-md relative group">
                                    {user?.name?.charAt(0) || 'U'}
                                    <button className="absolute bottom-1 right-1 bg-teal-600 p-2 rounded-full text-white shadow-sm hover:bg-teal-700 transition-colors">
                                        <Camera size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-3">{user?.name}</h3>
                            <p className="text-gray-500 text-sm dark:text-gray-400">{user?.email}</p>

                            <div className="mt-6 flex justify-center gap-2">
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                                    Active
                                </span>
                                <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full border border-teal-100 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800">
                                    Verified
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats or Info (Optional) */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                            <Shield size={18} className="mr-2 text-indigo-500" />
                            Security Status
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Password Strength</span>
                                <span className="text-green-600 dark:text-green-400 font-bold">Strong</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                <div className="bg-green-500 h-1.5 rounded-full w-full"></div>
                            </div>
                            <div className="flex items-center justify-between text-sm pt-2">
                                <span className="text-gray-600 dark:text-gray-400">2FA Enabled</span>
                                <span className={formData.twoFactor ? "text-green-600 dark:text-green-400 font-bold" : "text-gray-400 dark:text-gray-500 font-bold"}>
                                    {formData.twoFactor ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Forms */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                                <User size={20} className="mr-2 text-teal-600 dark:text-teal-400" />
                                Personal Information
                            </h3>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-sm bg-white dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm bg-white dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Role</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    disabled
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 capitalize cursor-not-allowed text-sm"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-1">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Bio</label>
                                <textarea
                                    name="bio"
                                    rows="3"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all text-sm resize-none bg-white dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors disabled:opacity-70"
                            >
                                {loading ? 'Saving...' : (
                                    <>
                                        <Save size={18} className="mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Security Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
                                <Lock size={20} className="mr-2 text-purple-600" />
                                Security Settings
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-white">Two-Factor Authentication</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Secure your account with 2FA.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="twoFactor"
                                        checked={formData.twoFactor}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-100 dark:peer-focus:ring-teal-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-white">Email Notifications</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Receive updates about your appointments.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="notifications"
                                        checked={formData.notifications}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-100 dark:peer-focus:ring-teal-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                                </label>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                                <button className="text-sm font-medium text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
