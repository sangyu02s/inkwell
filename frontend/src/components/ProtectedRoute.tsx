import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/auth/login?redirect=${location.pathname}`} replace />;
  }

  return <>{children}</>;
}