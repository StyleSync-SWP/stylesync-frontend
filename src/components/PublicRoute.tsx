import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

interface PublicRouteProps {
  redirectPath?: string;
}

// Redirects authenticated users away from auth pages (login, signup, etc.)
export default function PublicRoute({ redirectPath = '/dashboard' }: PublicRouteProps) {
  const { isAuthenticated } = useAuthStore();

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // User is not authenticated, allow access to public route
  return <Outlet />;
}
