import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';

const AdminStats = ({ stats }) => {
    const statItems = [
        {
            label: 'Total Appointments',
            value: stats.total || 0,
            icon: Users,
            color: 'bg-teal-500',
            textColor: 'text-teal-600',
            bgLight: 'bg-teal-50 dark:bg-teal-900/20 dark:text-teal-400'
        },
        {
            label: 'Pending',
            value: stats.pending || 0,
            icon: Clock,
            color: 'bg-yellow-500',
            textColor: 'text-yellow-600',
            bgLight: 'bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400'
        },
        {
            label: 'Confirmed',
            value: stats.confirmed || 0,
            icon: CheckCircle,
            color: 'bg-green-500',
            textColor: 'text-green-600',
            bgLight: 'bg-green-50 dark:bg-green-900/20 dark:text-green-400'
        },
        {
            label: 'Cancelled',
            value: stats.cancelled || 0,
            icon: XCircle,
            color: 'bg-red-500',
            textColor: 'text-red-600',
            bgLight: 'bg-red-50 dark:bg-red-900/20 dark:text-red-400'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-start justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-2">{item.value}</h3>
                    </div>
                    <div className={`p-3 rounded-lg ${item.bgLight}`}>
                        <item.icon size={24} className={item.textColor} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminStats;
