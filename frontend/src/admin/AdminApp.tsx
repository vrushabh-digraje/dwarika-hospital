
function SectionPermissionGuard({
  permissionKey,
  children,
}: {
  permissionKey: string;
  children: React.ReactNode;
}) {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('admin_user') || '{}');
    } catch {
      return {};
    }
  })();

  const isStaff = user?.role === 'STAFF' && Boolean(user?.staffId);
  const isSuperAdmin = !isStaff || (Array.isArray(user?.permissions) && user?.permissions.includes('*'));
  const userPermissions: string[] = Array.isArray(user?.permissions) ? user.permissions : [];

  if (isSuperAdmin || userPermissions.includes(permissionKey)) {
    return <>{children}</>;
  }

  return (
    <div className="p-8 max-w-lg mx-auto my-12 text-center bg-white rounded-3xl border border-ink-200 shadow-md space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-2xl font-bold">
        🔒
      </div>
      <h3 className="text-xl font-bold text-ink-900">Access Restricted</h3>
      <p className="text-xs text-ink-500 leading-relaxed">
        You do not have permission to access the <strong>{permissionKey}</strong> section. Please contact your Hospital Administrator to grant access.
      </p>
      <div className="pt-2">
        <a
          href="/admin"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#17372f] text-white text-xs font-bold hover:bg-[#1f5144] transition shadow-sm"
        >
          Return to Allowed Dashboard
        </a>
      </div>
    </div>
  );
}

import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import { modules } from './config/modules';
import { LoadingBlock } from './components/ui';
import ResourcePage from './pages/ResourcePage';

function AdminScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search]);

  return null;
}

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const HomepagePage = lazy(() => import('./pages/HomepagePage'));
const AboutAdminPage = lazy(() => import('./pages/AboutPage'));
const MediaLibraryPage = lazy(() => import('./pages/MediaLibraryPage'));
const AppointmentsPage = lazy(() => import('./pages/AppointmentsPage'));
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
      <AdminScrollToTop />
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
          <Route path="settings" element={<SectionPermissionGuard permissionKey="settings"><SettingsPage /></SectionPermissionGuard>} />
          <Route path="homepage" element={<SectionPermissionGuard permissionKey="homepage"><HomepagePage /></SectionPermissionGuard>} />
          <Route path="about" element={<SectionPermissionGuard permissionKey="about"><AboutAdminPage /></SectionPermissionGuard>} />
          <Route path="media" element={<SectionPermissionGuard permissionKey="media"><MediaLibraryPage /></SectionPermissionGuard>} />
          <Route path="appointments" element={<SectionPermissionGuard permissionKey="appointments"><AppointmentsPage /></SectionPermissionGuard>} />
          {modules
            .filter((mod) => mod.path !== 'appointments')
            .map((mod) => (
              <Route
                key={mod.path}
                path={mod.path}
                element={
                  <SectionPermissionGuard permissionKey={mod.key}>
                    <ResourcePage module={mod} />
                  </SectionPermissionGuard>
                }
              />
            ))}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
