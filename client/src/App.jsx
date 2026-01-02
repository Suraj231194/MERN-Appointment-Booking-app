import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PatientDashboard from './pages/dashboard/PatientDashboard';
import DoctorDashboard from './pages/dashboard/DoctorDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const DashboardHome = () => {
  const { user } = useAuthStore();
  if (!user) return null;
  return user.role === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />;
};

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
