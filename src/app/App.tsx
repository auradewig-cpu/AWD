import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAdminAuth } from '@/admin/AuthContext';
import { ProtectedRoute } from '@/admin/ProtectedRoute';
import { AdminLayout } from '@/admin/AdminLayout';
import { HomePage } from './pages/HomePage';
import { AdminLogin } from './pages/AdminLogin';

const DemoTierPage = lazy(() => import('./pages/DemoTierPage'));

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminHero = lazy(() => import('./pages/admin/AdminHero'));
const AdminPricing = lazy(() => import('./pages/admin/AdminPricing'));
const AdminProcess = lazy(() => import('./pages/admin/AdminProcess'));
const AdminFAQ = lazy(() => import('./pages/admin/AdminFAQ'));
const AdminContact = lazy(() => import('./pages/admin/AdminContact'));
const AdminTrust = lazy(() => import('./pages/admin/AdminTrust'));
const AdminWhy = lazy(() => import('./pages/admin/AdminWhy'));
const AdminDemo = lazy(() => import('./pages/admin/AdminDemo'));
const AdminPromo = lazy(() => import('./pages/admin/AdminPromo'));

function AdminIndexRedirect() {
  const { isAuthenticated } = useAdminAuth();
  return <Navigate to={isAuthenticated ? '/admin/dashboard' : '/admin/login'} replace />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo/:tier" element={<Suspense fallback={null}><DemoTierPage /></Suspense>} />

        {/* All admin routes share the AuthProvider */}
        <Route
          path="/admin/*"
          element={
            <AuthProvider>
              <Suspense fallback={
                <div style={{
                  minHeight: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#0a0a0a',
                  color: '#888',
                  fontSize: 14,
                  fontFamily: 'sans-serif',
                }}>
                  Memuat panel admin...
                </div>
              }>
                <Routes>
                  <Route path="login" element={<AdminLogin />} />
                  <Route index element={<AdminIndexRedirect />} />
                  <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="hero" element={<AdminHero />} />
                      <Route path="pricing" element={<AdminPricing />} />
                      <Route path="process" element={<AdminProcess />} />
                      <Route path="faq" element={<AdminFAQ />} />
                      <Route path="contact" element={<AdminContact />} />
                      <Route path="demo" element={<AdminDemo />} />
                      <Route path="trust" element={<AdminTrust />} />
                      <Route path="why" element={<AdminWhy />} />
                      <Route path="promo" element={<AdminPromo />} />
                      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Route>
                  </Route>
                </Routes>
              </Suspense>
            </AuthProvider>
          }
        />
      </Routes>
    </HashRouter>
  );
}
