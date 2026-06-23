import { HashRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAdminAuth } from '@/admin/AuthContext';
import { ProtectedRoute } from '@/admin/ProtectedRoute';
import { AdminLayout } from '@/admin/AdminLayout';
import { HomePage } from './pages/HomePage';
import { DemoTierPage } from './pages/DemoTierPage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminHero } from './pages/admin/AdminHero';
import { AdminPricing } from './pages/admin/AdminPricing';
import { AdminProcess } from './pages/admin/AdminProcess';
import { AdminFAQ } from './pages/admin/AdminFAQ';
import { AdminContact } from './pages/admin/AdminContact';
import { AdminTrust } from './pages/admin/AdminTrust';
import { AdminWhy } from './pages/admin/AdminWhy';
import { AdminDemo } from './pages/admin/AdminDemo';

function AdminIndexRedirect() {
  const { isAuthenticated } = useAdminAuth();
  return <Navigate to={isAuthenticated ? '/admin/dashboard' : '/admin/login'} replace />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo/:tier" element={<DemoTierPage />} />

        {/* All admin routes share the AuthProvider */}
        <Route
          path="/admin/*"
          element={
            <AuthProvider>
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
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                  </Route>
                </Route>
              </Routes>
            </AuthProvider>
          }
        />
      </Routes>
    </HashRouter>
  );
}
