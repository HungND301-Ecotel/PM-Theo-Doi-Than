import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth';
import { ROUTES } from '@/shared/constants/routes';

export function PrivateRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  return <Outlet />;
}
