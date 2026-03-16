import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Loader } from './components/ui/Loader';

const wrap = (Component: React.ComponentType) => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader size="lg" text="Loading…" /></div>}>
    <Component />
  </Suspense>
);

const LandingPage          = lazy(() => import('./pages/LandingPage'));
const LoginPage            = lazy(() => import('./pages/LoginPage'));
const RegisterPage         = lazy(() => import('./pages/RegisterPage'));
const UserDashboard        = lazy(() => import('./pages/UserDashboard'));
const ClaimsListPage       = lazy(() => import('./pages/ClaimsListPage'));
const NewClaimPage         = lazy(() => import('./pages/NewClaimPage'));
const ClaimDetailPage      = lazy(() => import('./pages/ClaimDetailPage'));
const AdminDashboard       = lazy(() => import('./pages/AdminDashboard'));
const AdminClaimReviewPage = lazy(() => import('./pages/AdminClaimReviewPage'));
const AnalyticsPage        = lazy(() => import('./pages/AnalyticsPage'));

export const router = createBrowserRouter([
  { path: '/', element: wrap(LandingPage) },
  { path: '/login', element: wrap(LoginPage) },
  { path: '/register', element: wrap(RegisterPage) },

  // Authenticated user routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: wrap(UserDashboard) },
          { path: '/claims', element: wrap(ClaimsListPage) },
          { path: '/claims/new', element: wrap(NewClaimPage) },
          { path: '/claims/:id', element: wrap(ClaimDetailPage) },
        ],
      },
    ],
  },

  // Admin-only routes
  {
    element: <ProtectedRoute requiredRole="admin" />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/admin', element: wrap(AdminDashboard) },
          { path: '/admin/claims', element: wrap(ClaimsListPage) },
          { path: '/admin/claims/:id', element: wrap(AdminClaimReviewPage) },
          { path: '/admin/analytics', element: wrap(AnalyticsPage) },
          { path: '/admin/fraud', element: wrap(AnalyticsPage) },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);
