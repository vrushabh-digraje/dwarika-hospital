import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck2,
  FolderOpen,
  Inbox,
  Newspaper,
  Plus,
  Stethoscope,
  Building2,
  Images,
} from 'lucide-react';
import { toast } from 'sonner';
import { getDashboard } from '../api/cmsApi';
import { Badge, Card, LoadingBlock, PageHeader, StatusBadge } from '../components/ui';
import { formatDate } from '../lib/format';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingBlock label="Loading dashboard…" />;
  if (!data) return <div className="text-sm text-ink-500">Unable to load dashboard.</div>;

  const cards = [
    { label: 'Doctors', value: data.content?.doctors?.total || 0, hint: data.content?.doctors?.published || 0, icon: Stethoscope, to: '/admin/doctors' },
    { label: 'Departments', value: data.content?.departments?.total || 0, hint: data.content?.departments?.published || 0, icon: Building2, to: '/admin/departments' },
    { label: 'Blogs', value: data.content?.blogs?.total || 0, hint: data.content?.blogs?.published || 0, icon: Newspaper, to: '/admin/blogs' },
    { label: 'Gallery', value: data.content?.gallery?.total || 0, hint: data.content?.gallery?.published || 0, icon: Images, to: '/admin/gallery' },
    { label: 'Media Files', value: data.media?.total || 0, hint: 'library', icon: FolderOpen, to: '/admin/media' },
    { label: 'New Enquiries', value: data.inbox?.newEnquiries || 0, hint: 'inbox', icon: Inbox, to: '/admin/enquiries' },
    { label: 'Pending Appointments', value: data.inbox?.pendingAppointments || 0, hint: 'queue', icon: CalendarCheck2, to: '/admin/appointments' },
  ];

  const quickActions = [
    { label: 'Add Doctor', to: '/admin/doctors' },
    { label: 'Add Blog', to: '/admin/blogs' },
    { label: 'Upload Media', to: '/admin/media' },
    { label: 'Edit Homepage', to: '/admin/homepage' },
    { label: 'Website Settings', to: '/admin/settings' },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Content health, recent updates, and quick actions for Dwarika Hospital CMS."
        breadcrumbs={[{ label: 'CMS' }, { label: 'Dashboard' }]}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} to={card.to}>
              <Card className="group p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">{card.label}</div>
                    <div className="mt-2 font-display text-3xl font-semibold text-ink-900">{card.value}</div>
                    <div className="mt-1 text-xs text-ink-500">
                      {typeof card.hint === 'number' ? `${card.hint} published` : card.hint}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-brand-50 p-3 text-brand-700 transition group-hover:bg-brand-100">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 className="font-display text-lg font-semibold">Recent Updates</h2>
            <Badge tone="brand">Live</Badge>
          </div>
          <div className="divide-y divide-ink-100">
            {(data.recentUpdates || []).length === 0 ? (
              <div className="px-5 py-10 text-sm text-ink-500">No recent activity yet.</div>
            ) : (
              data.recentUpdates.map((item: any, idx: number) => (
                <div key={`${item.module}-${idx}`} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div>
                    <div className="text-sm font-medium text-ink-900">{item.title}</div>
                    <div className="text-xs text-ink-500">{item.module}</div>
                  </div>
                  <div className="text-right">
                    {item.status && <StatusBadge status={item.status} />}
                    <div className="mt-1 text-[11px] text-ink-400">{formatDate(item.updatedAt)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <div className="border-b border-ink-100 px-5 py-4">
            <h2 className="font-display text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="space-y-2 p-4">
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-50/60 px-3 py-3 text-sm font-medium text-ink-800 transition hover:border-brand-200 hover:bg-brand-50"
              >
                <Plus className="h-4 w-4 text-brand-700" />
                {action.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
