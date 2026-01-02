import { useAuthStore } from '../../store/authStore';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import AdminDashboard from './AdminDashboard';

const DashboardHome = () => {
    const { user } = useAuthStore();

    if (!user) return null;

    if (user.role === 'admin') {
        return <AdminDashboard />;
    }

    if (user.role === 'doctor') {
        return <DoctorDashboard />;
    }

    return <PatientDashboard />;
};

export default DashboardHome;
