import { Navigate, Outlet } from 'react-router';
import { useAdminAuth } from './AuthContext';

export function ProtectedRoute() {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
