import { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  ExternalLink,
  RefreshCw,
  Edit3,
  Check,
  Ban,
  AlertTriangle,
  Globe,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { getPageStatuses, updatePageStatus, updateAllPageStatuses, type PageStatusItem } from '../api/cmsApi';
import { Button, Card, Input, Label, LoadingBlock, PageHeader, Textarea } from '../components/ui';
import { cn } from '../lib/format';

export default function PageStatusPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pages, setPages] = useState<PageStatusItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const fetchStatuses = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      const res = await getPageStatuses();
      setPages(res.items || []);
      if (showToast) toast.success('Page statuses refreshed');
    } catch (e: any) {
      toast.error(e.message || 'Failed to fetch page statuses');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleToggle = async (page: PageStatusItem) => {
    const nextStatus = page.status === 'active' ? 'blocked' : 'active';
    const originalPages = [...pages];

    // Optimistic update
    setPages((prev) =>
      prev.map((p) => (p.pageKey === page.pageKey ? { ...p, status: nextStatus } : p))
    );

    try {
      await updatePageStatus(page.pageKey, { status: nextStatus });
      toast.success(
        nextStatus === 'blocked'
          ? `🔒 ${page.name} is now BLOCKED on main website. Visitors will see the hospital notice.`
          : `✅ ${page.name} is now ACTIVE and live on main website.`
      );
    } catch (e: any) {
      setPages(originalPages);
      toast.error(e.message || 'Failed to update page status');
    }
  };

  const startEditingNotice = (page: PageStatusItem) => {
    setEditingKey(page.pageKey);
    setEditTitle(page.noticeTitle || '');
    setEditMessage(page.noticeMessage || '');
  };

  const cancelEditingNotice = () => {
    setEditingKey(null);
    setEditTitle('');
    setEditMessage('');
  };

  const saveNotice = async (pageKey: string) => {
    setSavingKey(pageKey);
    try {
      const updated = await updatePageStatus(pageKey, {
        noticeTitle: editTitle.trim(),
        noticeMessage: editMessage.trim(),
      });
      setPages((prev) =>
        prev.map((p) =>
          p.pageKey === pageKey
            ? { ...p, noticeTitle: updated.noticeTitle, noticeMessage: updated.noticeMessage }
            : p
        )
      );
      toast.success('Page notice details saved successfully');
      setEditingKey(null);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save notice details');
    } finally {
      setSavingKey(null);
    }
  };

  const handleActivateAll = async () => {
    if (!window.confirm('Are you sure you want to activate ALL pages on the main website?')) return;
    try {
      setRefreshing(true);
      const updatedList = pages.map((p) => ({ ...p, status: 'active' as const }));
      await updateAllPageStatuses(updatedList);
      setPages(updatedList);
      toast.success('All pages are now active and live on the website');
    } catch (e: any) {
      toast.error(e.message || 'Failed to activate all pages');
    } finally {
      setRefreshing(false);
    }
  };

  const counts = useMemo(() => {
    const total = pages.length;
    const active = pages.filter((p) => p.status === 'active').length;
    const blocked = pages.filter((p) => p.status === 'blocked').length;
    return { total, active, blocked };
  }, [pages]);

  const filteredPages = useMemo(() => {
    return pages.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.path.toLowerCase().includes(q) ||
        p.pageKey.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && p.status === 'active') ||
        (statusFilter === 'blocked' && p.status === 'blocked');
      return matchesSearch && matchesStatus;
    });
  }, [pages, search, statusFilter]);

  if (loading) return <LoadingBlock label="Loading page controls…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Website Page Controls (Active / Block)"
        description="Enable or block specific website pages. When a page is blocked, visitors opening that URL will see an official hospital notice instead of the normal content."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Page Controls' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              loading={refreshing}
              onClick={() => fetchStatuses(true)}
              className="gap-1.5"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {counts.blocked > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleActivateAll}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="h-4 w-4" />
                Activate All Pages ({counts.blocked} Blocked)
              </Button>
            )}
          </div>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Total Website Pages</p>
            <p className="text-2xl font-bold text-ink-900 mt-1">{counts.total}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Globe className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500 bg-white shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Active (Live Content)</p>
            <p className="text-2xl font-bold text-emerald-800 mt-1">{counts.active}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </Card>

        <Card
          className={cn(
            'p-4 border-l-4 bg-white shadow-sm flex items-center justify-between',
            counts.blocked > 0 ? 'border-l-red-500 bg-red-50/20' : 'border-l-ink-200'
          )}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-red-700">Blocked (Notice Active)</p>
            <p className="text-2xl font-bold text-red-800 mt-1">{counts.blocked}</p>
          </div>
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              counts.blocked > 0 ? 'bg-red-100 text-red-700' : 'bg-ink-100 text-ink-500'
            )}
          >
            <ShieldAlert className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Helper Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 flex items-start gap-3 shadow-sm">
        <HelpCircle className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-ink-700 space-y-1">
          <p className="font-semibold text-ink-900">How Page Active / Block Works:</p>
          <p>
            When a page is set to <strong>Blocked</strong>, the page will still open on the main website with the header,
            navigation bar, and footer intact, but all normal page content is replaced with a customized official hospital notice
            (e.g., maintenance, service notice, or emergency contact).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 shadow-sm bg-white flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search page name or URL path…"
            className="pl-9 h-10 text-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap',
              statusFilter === 'all'
                ? 'bg-[#17372f] text-white shadow-sm'
                : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
            )}
          >
            All Pages ({counts.total})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap',
              statusFilter === 'active'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            )}
          >
            Active Only ({counts.active})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('blocked')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap',
              statusFilter === 'blocked'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-red-50 text-red-800 hover:bg-red-100'
            )}
          >
            Blocked Only ({counts.blocked})
          </button>
        </div>
      </Card>

      {/* Pages List */}
      <div className="space-y-3">
        {filteredPages.length === 0 ? (
          <Card className="p-12 text-center text-ink-500 bg-white">
            <Globe className="h-10 w-10 mx-auto text-ink-300 mb-2" />
            <p className="font-semibold text-ink-700">No pages matched your filter</p>
            <p className="text-xs text-ink-500 mt-1">Try clearing your search query or switching tabs.</p>
          </Card>
        ) : (
          filteredPages.map((page) => {
            const isBlocked = page.status === 'blocked';
            const isEditing = editingKey === page.pageKey;

            return (
              <Card
                key={page.pageKey}
                className={cn(
                  'p-5 transition-all duration-200 border bg-white shadow-sm hover:shadow',
                  isBlocked
                    ? 'border-red-300 bg-red-50/15 ring-1 ring-red-300/50'
                    : 'border-ink-200/90'
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Page Info */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-display text-base font-bold text-ink-900">{page.name}</h4>
                      <code className="px-2 py-0.5 rounded-md bg-ink-100 text-ink-700 text-xs font-mono">
                        {page.path}
                      </code>
                      <a
                        href={page.path}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline ml-1"
                        title="Open page in website"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Live View
                      </a>
                    </div>

                    <p className="text-xs text-ink-500">
                      Current public status:{' '}
                      {isBlocked ? (
                        <span className="font-semibold text-red-700">
                          Blocked — displaying notice: &quot;{page.noticeTitle || 'Notice Screen'}&quot;
                        </span>
                      ) : (
                        <span className="font-semibold text-emerald-700">Active — full page content visible</span>
                      )}
                    </p>
                  </div>

                  {/* Right: Toggle Button & Notice Settings Button */}
                  <div className="flex items-center gap-3 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => (isEditing ? cancelEditingNotice() : startEditingNotice(page))}
                      className={cn(
                        'text-xs gap-1.5',
                        isEditing ? 'border-primary text-primary' : 'text-ink-700'
                      )}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      {isEditing ? 'Close Notice Edit' : 'Edit Notice'}
                    </Button>

                    <button
                      type="button"
                      onClick={() => handleToggle(page)}
                      className={cn(
                        'relative inline-flex h-9 w-32 items-center rounded-xl px-2.5 font-bold text-xs transition shadow-sm select-none cursor-pointer',
                        isBlocked
                          ? 'bg-red-600 hover:bg-red-700 text-white justify-start pl-8'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white justify-end pr-8'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-1 bottom-1 w-7 rounded-lg bg-white text-ink-900 flex items-center justify-center text-xs shadow transition-all duration-200',
                          isBlocked ? 'left-1 text-red-700' : 'right-1 text-emerald-700'
                        )}
                      >
                        {isBlocked ? <Ban className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </span>
                      <span>{isBlocked ? 'BLOCKED' : 'ACTIVE'}</span>
                    </button>
                  </div>
                </div>

                {/* Notice Settings Expandable Section */}
                {isEditing && (
                  <div className="mt-4 pt-4 border-t border-ink-100 bg-ink-50/60 -mx-5 -mb-5 p-5 rounded-b-2xl space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-ink-800">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      Customize Notice Displayed When This Page is Blocked
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Notice Headline / Title</Label>
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="e.g. Service Temporarily Unavailable"
                          className="bg-white text-sm"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-xs">Notice Description / Message</Label>
                        <Textarea
                          value={editMessage}
                          onChange={(e) => setEditMessage(e.target.value)}
                          rows={3}
                          placeholder="e.g. This service is temporarily under scheduled maintenance. For immediate inquiries, please call reception at 031-590123."
                          className="bg-white text-sm"
                        />
                      </div>
                    </div>

                    {/* Live Preview of Notice */}
                    <div className="p-3 rounded-xl bg-white border border-amber-200 text-xs space-y-1">
                      <p className="font-bold text-ink-900 flex items-center gap-1.5 text-amber-800">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        Preview: {editTitle.trim() || 'Service Temporarily Unavailable'}
                      </p>
                      <p className="text-ink-600 leading-relaxed">
                        {editMessage.trim() || 'This page is currently under maintenance. Please contact Dwarika Hospital.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button type="button" variant="ghost" size="sm" onClick={cancelEditingNotice}>
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        loading={savingKey === page.pageKey}
                        onClick={() => saveNotice(page.pageKey)}
                        className="bg-[#17372f] text-white hover:bg-[#1f5144]"
                      >
                        Save Notice
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
