import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ShieldAlert, ShieldCheck, Check, Ban, Edit3, ExternalLink } from 'lucide-react';
import { getPageStatuses, updatePageStatus, type PageStatusItem } from '../api/cmsApi';
import { Button, Card, Input, Label } from './ui';
import { cn } from '../lib/format';

export function PageStatusBanner({ pageKey }: { pageKey: string }) {
  const [page, setPage] = useState<PageStatusItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPageStatuses()
      .then((res) => {
        const found = (res.items || []).find((p) => p.pageKey === pageKey);
        if (found) {
          setPage(found);
          setEditTitle(found.noticeTitle || '');
          setEditMessage(found.noticeMessage || '');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pageKey]);

  if (loading || !page) return null;

  const isBlocked = page.status === 'blocked';

  const handleToggle = async () => {
    const nextStatus = isBlocked ? 'active' : 'blocked';
    setPage((prev) => (prev ? { ...prev, status: nextStatus } : null));

    try {
      await updatePageStatus(pageKey, { status: nextStatus });
      try {
        sessionStorage.removeItem('dwarika_page_status');
      } catch {}
      toast.success(
        nextStatus === 'blocked'
          ? `🔒 ${page.name} is now BLOCKED on the website. Visitors will see the notice.`
          : `✅ ${page.name} is now ACTIVE and live on the website.`
      );
    } catch (e: any) {
      setPage((prev) => (prev ? { ...prev, status: isBlocked ? 'blocked' : 'active' } : null));
      toast.error(e.message || 'Failed to update page status');
    }
  };

  const handleSaveNotice = async () => {
    setSaving(true);
    try {
      const res = await updatePageStatus(pageKey, {
        noticeTitle: editTitle.trim(),
        noticeMessage: editMessage.trim(),
      });
      setPage(res);
      setIsEditing(false);
      toast.success('Notice saved for this page');
    } catch (e: any) {
      toast.error(e.message || 'Failed to save notice');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      className={cn(
        'p-4 transition-all duration-200 border shadow-sm mb-6',
        isBlocked
          ? 'bg-red-50/70 border-red-300 ring-1 ring-red-300/60'
          : 'bg-emerald-50/50 border-emerald-200'
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm',
              isBlocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
            )}
          >
            {isBlocked ? <ShieldAlert className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-700">
                Public Website Page Status:
              </span>
              <span
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-xs font-bold',
                  isBlocked ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                )}
              >
                {isBlocked ? '🔴 BLOCKED (Notice Active)' : '🟢 ACTIVE (Live on Website)'}
              </span>
              <a
                href={page.path}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline ml-1"
              >
                <ExternalLink className="h-3 w-3" />
                View Page
              </a>
            </div>
            <p className="text-xs text-ink-500 mt-0.5">
              {isBlocked
                ? `Visitors visiting ${page.path} will see the notice: "${page.noticeTitle || 'Service Notice'}" instead of page contents.`
                : `Page is publicly visible to all visitors at ${page.path}.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs gap-1.5 h-8 bg-white"
          >
            <Edit3 className="h-3.5 w-3.5" />
            {isEditing ? 'Cancel' : 'Edit Notice'}
          </Button>

          <button
            type="button"
            onClick={handleToggle}
            className={cn(
              'relative inline-flex h-8 w-28 items-center rounded-xl px-2 font-bold text-xs transition shadow-sm select-none cursor-pointer',
              isBlocked
                ? 'bg-red-600 hover:bg-red-700 text-white justify-start pl-7'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white justify-end pr-7'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 bottom-0.5 w-6 rounded-lg bg-white flex items-center justify-center text-xs shadow transition-all duration-200',
                isBlocked ? 'left-0.5 text-red-700' : 'right-0.5 text-emerald-700'
              )}
            >
              {isBlocked ? <Ban className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
            </span>
            <span>{isBlocked ? 'BLOCKED' : 'ACTIVE'}</span>
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="mt-3 pt-3 border-t border-ink-100 bg-white p-3 rounded-xl space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Notice Title</Label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Notice headline..."
                className="text-xs h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Notice Message</Label>
              <Input
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                placeholder="Notice explanation..."
                className="text-xs h-8"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              loading={saving}
              onClick={handleSaveNotice}
              className="bg-[#17372f] text-white"
            >
              Save Notice
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
