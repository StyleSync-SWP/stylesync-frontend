import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

interface ProtectedRouteProps {
  redirectPath?: string;
}

export default function ProtectedRoute({ redirectPath = '/login' }: ProtectedRouteProps) {
  const { isAuthenticated, token } = useAuthStore();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated || !token) {
    // Redirect to login, but save the location they were trying to access
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // User is authenticated, render the child routes
  return <Outlet />;
}
