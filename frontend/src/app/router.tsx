import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { useAuthStore } from '@/modules/auth';
import { ROUTES } from '@/shared/constants/routes';
import { MainLayout } from '@/layouts/MainLayout';
import { PageLoader } from '@/shared/components/loading/PageLoader';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('@/modules/auth/pages/LoginPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ReceiptListPage = lazy(() => import('@/pages/ReceiptListPage'));

// ─── Utils ───────────────────────────────────────────────────────────────────
function isTokenExpired(token: string): boolean {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

// ─── PrivateRoute ─────────────────────────────────────────────────────────────
function PrivateRoute() {
  // TODO: xóa dòng này khi BE ready
  const DEV_BYPASS = import.meta.env.DEV;
  if (DEV_BYPASS) return <Outlet />;

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  if (accessToken && isTokenExpired(accessToken)) {
    clearAuth();
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  return <Outlet />;
}

// ─── PublicOnlyRoute ──────────────────────────────────────────────────────────
function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  if (accessToken && isTokenExpired(accessToken)) {
    clearAuth();
    return <Outlet />;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}

// ─── Router config ────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  // Public only routes (đã login → không vào được)
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: ROUTES.AUTH.LOGIN,
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
    ],
  },

  // Static public routes
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },

  // Private routes
  {
    element: <PrivateRoute />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: 'receipts',
            element: <ReceiptListPage />,
          },
        ],
      },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to={ROUTES.NOT_FOUND} replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
