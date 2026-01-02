import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PublicRoute = ({ children }) => {
    const { user, isAuthenticated } = useAuthStore();
    const location = useLocation();

    if (isAuthenticated && user) {
        return <Navigate to="/dashboard" replace state={{ from: location }} />;
    }

    return children;
};

export default PublicRoute;
