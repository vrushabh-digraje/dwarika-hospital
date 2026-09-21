import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, PanelLeftClose, PanelLeftOpen, Sparkles, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { modules, navGroups, specialNav } from '../config/modules';
import { setSidebarOpen, toggleSidebarCollapsed, type RootState } from '../store';
import { cn } from '../lib/format';
import { Button } from '../components/ui';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sidebarOpen, sidebarCollapsed } = useSelector((s: RootState) => s.ui);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    ...specialNav,
    ...modules.map((m) => ({
      path: m.path,
      label: m.label,
      icon: m.icon,
      group: m.group,
    })),
  ];

  const Sidebar = (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-white/10 bg-[linear-gradient(180deg,#17372f_0%,#1f5144_45%,#246453_100%)] text-white transition-all',
        sidebarCollapsed ? 'w-[84px]' : 'w-[280px]'
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
          <Sparkles className="h-5 w-5" />
        </div>
        {!sidebarCollapsed && (
          <div>
            <div className="font-display text-lg font-semibold leading-tight">Dwarika CMS</div>
            <div className="text-[11px] text-white/65">Healthcare Content Hub</div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => {
          const items = navItems.filter((item) => item.group === group.key);
          if (!items.length) return null;
          return (
            <div key={group.key}>
              {!sidebarCollapsed && (
                <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                  {group.label}
                </div>
              )}
              <div className="space-y-1">
                {items.map((item) => {
                  const to = item.path ? `/admin/${item.path}` : '/admin';
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      end={!item.path}
                      onClick={() => dispatch(setSidebarOpen(false))}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition',
                          isActive
                            ? 'bg-white text-brand-800 shadow-sm'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        )
                      }
                      title={item.label}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={() => dispatch(toggleSidebarCollapsed())}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs text-white/80 hover:bg-white/15"
        >
          {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          {!sidebarCollapsed && 'Collapse'}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="admin-shell flex min-h-screen bg-[#f3f5f7] text-ink-900">
      <div className="hidden lg:block">{Sidebar}</div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => dispatch(setSidebarOpen(false))} />
          <div className="absolute inset-y-0 left-0 z-50 shadow-2xl">{Sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-ink-100 bg-white/85 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="lg:hidden" onClick={() => dispatch(setSidebarOpen(true))}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">Admin Console</div>
              <div className="text-sm text-ink-500">
                {location.pathname === '/admin' ? 'Dashboard' : location.pathname.replace('/admin/', '').replace(/-/g, ' ')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-ink-200 bg-white px-3 py-2 text-xs font-medium text-ink-700 hover:bg-ink-50"
            >
              View Website
            </a>
            <div className="hidden items-center gap-2 rounded-2xl border border-ink-100 bg-ink-50 px-3 py-1.5 sm:flex">
              <div className="h-8 w-8 rounded-xl bg-[#17372f] text-center text-sm font-semibold leading-8 text-white">A</div>
              <div className="text-xs">
                <div className="font-semibold text-ink-800">Administrator</div>
                <div className="text-ink-500 text-[11px]">admin@dwarikahospital.com</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
              title="Log out of CMS"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 md:px-6 md:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
