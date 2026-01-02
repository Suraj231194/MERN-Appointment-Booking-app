import { useAuthStore } from '../store/authStore';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import {
    LayoutGrid,
    Calendar,
    FileText,
    CreditCard,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    Stethoscope
} from 'lucide-react';
import { useState } from 'react';

const Dashboard = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const isActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true;
        if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
        { label: 'Appointment', path: '/dashboard/calendar', icon: Calendar },
        { label: 'Appointment Page', path: '/dashboard/appointments', icon: FileText },
        { label: 'Payment', path: '/dashboard/payments', icon: CreditCard },
        { label: 'Profile', path: '/dashboard/profile', icon: User },
        { label: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden fixed top-0 left-0 w-full bg-white dark:bg-gray-800 z-20 px-4 py-3 shadow-sm flex items-center justify-between border-b dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="bg-teal-600 p-1.5 rounded-lg">
                        <Stethoscope size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">MediBook</span>
                </div>
                <button onClick={toggleSidebar} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-20 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 z-30
                transform transition-transform duration-300 ease-in-out flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo Section */}
                <div className="h-20 flex items-center px-8 border-b border-gray-50 dark:border-gray-700">
                    <div className="bg-teal-600 p-2 rounded-xl shadow-lg shadow-teal-200 dark:shadow-teal-900/50">
                        <Stethoscope size={24} className="text-white" />
                    </div>
                    <span className="ml-3 text-2xl font-bold text-gray-800 dark:text-white tracking-tight">MediBook</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`
                                flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                                ${isActive(item.path)
                                    ? 'bg-teal-50 text-teal-600 font-semibold shadow-sm dark:bg-teal-900/20 dark:text-teal-400'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'}
                            `}
                        >
                            <item.icon
                                size={20}
                                className={`mr-3 transition-transform duration-200 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`}
                            />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer / Logout */}
                <div className="p-4 border-t border-gray-50 dark:border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group"
                    >
                        <LogOut size={20} className="mr-3 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Logout</span>
                    </button>

                    {/* User Mini Profile */}
                    <div className="mt-4 flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold shadow-sm">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Mobile Header Spacer */}
                <div className="h-[60px] lg:hidden flex-shrink-0" />

                {/* Header for Desktop (Optional, typically breadcrumbs or search) */}
                <header className="hidden lg:flex h-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700 px-8 items-center justify-between sticky top-0 z-10">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                            {user?.role === 'admin' ? `Hello, Super Admin 👋` : `Welcome back, ${user?.name}`}
                        </h1>
                        <p className="text-sm text-gray-400">Here is what's happening today.</p>
                    </div>
                    {/* Could add Search/Notifs here later */}
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
