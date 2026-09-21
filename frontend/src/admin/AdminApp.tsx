import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import { modules } from './config/modules';
import { LoadingBlock } from './components/ui';
import ResourcePage from './pages/ResourcePage';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const HomepagePage = lazy(() => import('./pages/HomepagePage'));
const AboutAdminPage = lazy(() => import('./pages/AboutPage'));
const MediaLibraryPage = lazy(() => import('./pages/MediaLibraryPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

export default function AdminApp() {
  return (
    <Suspense fallback={<div className="p-8"><LoadingBlock label="Loading admin…" /></div>}>
      <Routes>
        <Route path="login" element={<AdminLoginPage />} />
        <Route
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="homepage" element={<HomepagePage />} />
          <Route path="about" element={<AboutAdminPage />} />
          <Route path="media" element={<MediaLibraryPage />} />
          {modules.map((mod) => (
            <Route key={mod.path} path={mod.path} element={<ResourcePage module={mod} />} />
          ))}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
