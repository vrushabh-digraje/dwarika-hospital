import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExternalLink, Pencil, Plus, RefreshCw, Search, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import type { ModuleConfig } from '../config/modules';
import {
  createResource,
  deleteResource,
  listResource,
  toggleResourceStatus,
  updateResource,
} from '../api/cmsApi';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Input,
  LoadingBlock,
  Modal,
  PageHeader,
  Pagination,
  Select,
  StatusBadge,
} from '../components/ui';
import { ResourceForm } from '../components/ResourceForm';
import { formatDate, truncate } from '../lib/format';

export default function ResourcePage({ module }: { module: ModuleConfig }) {
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0, limit: 10, hasNext: false, hasPrev: false });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [extraFilters, setExtraFilters] = useState<Record<string, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [preview, setPreview] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<any | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listResource(module.resource, {
        page,
        limit: 10,
        search: search || undefined,
        status: status || undefined,
        ...extraFilters,
      });
      setItems(res.items);
      setMeta(res.meta);
    } catch (e: any) {
      toast.error(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [module.resource, page, search, status, extraFilters]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setDrawerOpen(true);
  };

  const onSave = async (values: Record<string, any>) => {
    setSaving(true);
    try {
      if (editing?._id) {
        await updateResource(module.resource, editing._id, values);
        toast.success(`${module.singular} updated`);
      } else {
        await createResource(module.resource, values);
        toast.success(`${module.singular} created`);
      }
      setDrawerOpen(false);
      setEditing(null);
      await load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!deleting?._id) return;
    setBusyId(deleting._id);
    try {
      await deleteResource(module.resource, deleting._id);
      toast.success(`${module.singular} deleted`);
      setDeleting(null);
      await load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const onToggle = async (item: any) => {
    if (!item.status) return;
    setBusyId(item._id);
    try {
      await toggleResourceStatus(module.resource, item._id);
      toast.success('Status updated');
      await load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const siteUrl = import.meta.env.VITE_PUBLIC_SITE_URL || '';

  const titleKey = useMemo(() => module.columns[0]?.key || 'title', [module.columns]);

  return (
    <div>
      <PageHeader
        title={module.label}
        description={module.description}
        breadcrumbs={[{ label: 'CMS' }, { label: module.label }]}
        actions={
          <>
            <Button variant="outline" onClick={load}><RefreshCw className="h-4 w-4" /> Refresh</Button>
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add {module.singular}</Button>
          </>
        }
      />

      <Card className="mb-4 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {module.searchable !== false && (
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <Input
                className="pl-9"
                placeholder={`Search ${module.label.toLowerCase()}…`}
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
              />
            </div>
          )}
          {module.statusFilter !== false && module.fields.some((f) => f.type === 'status') && (
            <Select
              className="w-full lg:w-40"
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
            >
              <option value="">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </Select>
          )}
          {module.filters?.map((filter) => (
            <Select
              key={filter.key}
              className="w-full lg:w-44"
              value={extraFilters[filter.key] || ''}
              onChange={(e) => {
                setPage(1);
                setExtraFilters((prev) => ({ ...prev, [filter.key]: e.target.value }));
              }}
            >
              <option value="">All {filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          ))}
        </div>
      </Card>

      {loading ? (
        <LoadingBlock />
      ) : items.length === 0 ? (
        <EmptyState
          title={`No ${module.label.toLowerCase()} yet`}
          description={`Create your first ${module.singular.toLowerCase()} to manage it from the CMS.`}
          action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add {module.singular}</Button>}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-ink-50/80 text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  {module.columns.map((col) => (
                    <th key={col.key} className="px-4 py-3 font-semibold">{col.label}</th>
                  ))}
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-t border-ink-100 hover:bg-brand-50/30">
                    {module.columns.map((col) => {
                      const value = item[col.key];
                      return (
                        <td key={col.key} className="px-4 py-3 align-middle">
                          {col.type === 'image' ? (
                            value ? (
                              <img src={value} alt="" className="h-10 w-10 rounded-lg object-cover ring-1 ring-ink-100" />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-ink-100" />
                            )
                          ) : col.type === 'status' ? (
                            <button type="button" onClick={() => onToggle(item)} disabled={busyId === item._id}>
                              <StatusBadge status={value} />
                            </button>
                          ) : col.type === 'date' ? (
                            formatDate(value)
                          ) : col.type === 'badge' ? (
                            <Badge tone="brand">{value || '—'}</Badge>
                          ) : (
                            <span className="text-ink-800">{truncate(String(value ?? '—'), 48)}</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setPreview(item)} title="Preview">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {module.previewPath?.(item) && (
                          <a
                            href={`${siteUrl}${module.previewPath(item)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-ink-600 hover:bg-ink-100"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => openEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setDeleting(item)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} />
        </Card>
      )}

      <Modal
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? `Edit ${module.singular}` : `Add ${module.singular}`}
        wide
      >
        <ResourceForm
          module={module}
          initialValues={editing || { status: 'draft' }}
          onSubmit={onSave}
          onCancel={() => setDrawerOpen(false)}
          loading={saving}
        />
      </Modal>

      <Modal open={!!preview} onClose={() => setPreview(null)} title="Preview" wide>
        {preview && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-xl font-semibold text-ink-900">
                {preview.title || preview.name || preview.question || preview[titleKey]}
              </h3>
              {preview.status && <StatusBadge status={preview.status} />}
            </div>
            {preview.imageUrl || preview.url || preview.logoUrl ? (
              <img
                src={preview.imageUrl || preview.url || preview.logoUrl}
                alt=""
                className="max-h-64 w-full rounded-2xl object-cover"
              />
            ) : null}
            <div className="grid gap-2 md:grid-cols-2">
              {Object.entries(preview)
                .filter(([key]) => !['_id', '__v', 'fullContent', 'contentHtml', 'requirementsHtml', 'responsibilitiesHtml'].includes(key))
                .slice(0, 12)
                .map(([key, value]) => (
                  <div key={key} className="rounded-xl bg-ink-50 px-3 py-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">{key}</div>
                    <div className="mt-0.5 break-words text-ink-700">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value ?? '—')}
                    </div>
                  </div>
                ))}
            </div>
            {(preview.fullContent || preview.content || preview.contentHtml || preview.bio || preview.answer) && (
              <div
                className="prose prose-sm max-w-none rounded-2xl border border-ink-100 p-4"
                dangerouslySetInnerHTML={{
                  __html:
                    preview.fullContent ||
                    preview.contentHtml ||
                    preview.content ||
                    preview.bio ||
                    preview.answer ||
                    '',
                }}
              />
            )}
            <p className="text-xs text-ink-400">Last updated: {formatDate(preview.updatedAt)}</p>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={onDelete}
        loading={busyId === deleting?._id}
        title={`Delete ${module.singular}?`}
        message="This action cannot be undone. The item will be permanently removed from the CMS."
      />
    </div>
  );
}
