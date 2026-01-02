import { useAuthStore } from '../store/authStore';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Dashboard = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">MediBook</h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                <nav className="mt-6 px-4 space-y-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {user?.role} Portal
                    </div>

                    <Link to="/dashboard" className="flex items-center px-4 py-3 text-gray-700 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <LayoutDashboard size={20} className="mr-3" />
                        Dashboard
                    </Link>

                    {/* Role specific links could go here if we had more pages */}
                    {/* 
                    <Link to="/dashboard/schedule" className="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <Calendar size={20} className="mr-3" />
                        Schedule
                    </Link> 
                    */}

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-auto"
                    >
                        <LogOut size={20} className="mr-3" />
                        Logout
                    </button>
                </nav>

                <div className="absolute bottom-0 w-full p-6 border-t border-gray-100 bg-white">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="bg-white shadow-sm md:hidden flex items-center justify-between p-4 z-10">
                    <h1 className="text-xl font-bold text-gray-800">MediBook</h1>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
                        <Menu size={24} />
                    </button>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-8">
                    {/* Greeting */}
                    <header className="mb-8 hidden md:block">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Hello, {user?.name} 👋
                        </h2>
                        <p className="text-gray-500 mt-1">Here is what's happening today.</p>
                    </header>

                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
