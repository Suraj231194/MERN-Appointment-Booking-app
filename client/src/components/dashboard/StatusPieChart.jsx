import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const StatusPieChart = ({ stats }) => {
    const data = [
        { name: 'Confirmed', value: stats.confirmed || 0, color: '#10B981' }, // Green-500
        { name: 'Pending', value: stats.pending || 0, color: '#F59E0B' },   // Yellow-500
        { name: 'Cancelled', value: stats.cancelled || 0, color: '#EF4444' }, // Red-500
        { name: 'Completed', value: stats.completed || 0, color: '#6B7280' }  // Gray-500
    ].filter(item => item.value > 0);

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg text-gray-400">
                No data available
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Appointment Distribution</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StatusPieChart;
