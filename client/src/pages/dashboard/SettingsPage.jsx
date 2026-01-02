import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, Globe, Moon, Shield, Smartphone, ChevronRight, Monitor, Key, CheckCircle } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('general');
    const { theme, setTheme } = useThemeStore();

    // Mock States
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        news: true,
        push: true
    });

    const [general, setGeneral] = useState({
        language: 'English',
        timezone: 'GMT-05:00 Eastern Time',
        theme: 'light'
    });

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
    ];

    const handleToggle = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="animate-fade-in pb-12">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h2>
                <p className="text-gray-500 text-sm dark:text-gray-400">Configure your application preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar / Tabs */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-8">
                        <nav className="flex flex-col p-2 space-y-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium
                                        ${activeTab === tab.id
                                            ? 'bg-teal-50 text-teal-600 shadow-sm dark:bg-teal-900/20 dark:text-teal-400'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'}
                                    `}
                                >
                                    <tab.icon size={18} className="mr-3" />
                                    {tab.label}
                                    {activeTab === tab.id && <ChevronRight size={16} className="ml-auto" />}
                                </button>
                            ))}
                        </nav>
                        <div className="p-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">System Status</h4>
                                <div className="flex items-center text-xs text-green-600 dark:text-green-400 font-semibold">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    All Systems Operational
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px]">
                        {/* GENERAL TAB */}
                        {activeTab === 'general' && (
                            <div className="animate-fade-in">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">General Preferences</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Display Language</label>
                                                <select className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm">
                                                    <option>English (US)</option>
                                                    <option>Spanish</option>
                                                    <option>French</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Zone</label>
                                                <select className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm">
                                                    <option>Pacific Time (US & Canada)</option>
                                                    <option>Eastern Time (US & Canada)</option>
                                                    <option>UTC</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-4">Appearance</h4>
                                            <div className="flex gap-4">
                                                <div
                                                    onClick={() => setTheme('light')}
                                                    className={`border-2 rounded-lg p-4 w-32 cursor-pointer relative transition-all
                                                        ${theme === 'light' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}
                                                    `}
                                                >
                                                    {theme === 'light' && <div className="absolute top-2 right-2 text-teal-500"><CheckCircle size={16} /></div>}
                                                    <div className="h-16 bg-white border border-gray-200 rounded mb-2 shadow-sm"></div>
                                                    <p className={`text-xs font-bold text-center ${theme === 'light' ? 'text-teal-700 dark:text-teal-400' : 'text-gray-600 dark:text-gray-400'}`}>Light</p>
                                                </div>
                                                <div
                                                    onClick={() => setTheme('dark')}
                                                    className={`border-2 rounded-lg p-4 w-32 cursor-pointer relative transition-all
                                                        ${theme === 'dark' ? 'border-teal-500 bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}
                                                    `}
                                                >
                                                    {theme === 'dark' && <div className="absolute top-2 right-2 text-white"><CheckCircle size={16} /></div>}
                                                    <div className="h-16 bg-gray-900 border border-gray-700 rounded mb-2 shadow-sm"></div>
                                                    <p className={`text-xs font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>Dark</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS TAB */}
                        {activeTab === 'notifications' && (
                            <div className="animate-fade-in">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Notification Settings</h3>
                                </div>
                                <div className="p-6 space-y-2">
                                    {[
                                        { key: 'email', title: 'Email Notifications', desc: 'Receive daily summaries and critical alerts.' },
                                        { key: 'push', title: 'Push Notifications', desc: 'Real-time alerts on your desktop.' },
                                        { key: 'sms', title: 'SMS Updates', desc: 'Get updates on your phone. (Extra charges may apply)' },
                                        { key: 'news', title: 'News & Updates', desc: 'Stay up to date with the latest features.' },
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={notifications[item.key]}
                                                    onChange={() => handleToggle(item.key)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-100 dark:peer-focus:ring-teal-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SECURITY TAB */}
                        {activeTab === 'security' && (
                            <div className="animate-fade-in">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Security & Privacy</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="flex items-start p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-lg">
                                        <Shield className="text-yellow-600 dark:text-yellow-500 mt-1 mr-3" size={20} />
                                        <div>
                                            <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-400">Recommendation</h4>
                                            <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">Enable 2FA to add an extra layer of security to your account.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3">
                                                        <Key size={20} className="text-gray-600 dark:text-gray-300" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800 dark:text-white text-sm">Password</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Last changed 3 months ago</p>
                                                    </div>
                                                </div>
                                                <button className="text-teal-600 dark:text-teal-400 text-sm font-bold hover:underline">Change</button>
                                            </div>
                                        </div>

                                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-3">Active Sessions</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <Monitor size={18} className="text-gray-400 mr-3" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Windows PC - Chrome</p>
                                                            <p className="text-xs text-green-600 dark:text-green-400">Active Now</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between opacity-60">
                                                    <div className="flex items-center">
                                                        <Smartphone size={18} className="text-gray-400 mr-3" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">iPhone 13 - Safari</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                                                        </div>
                                                    </div>
                                                    <button className="text-red-500 text-xs font-bold hover:underline">Revoke</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
