import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ExternalLink, Pencil, Plus, RefreshCw, Search, Trash2, Eye, Pill, CheckCircle2, AlertTriangle, AlertCircle,
  FileSpreadsheet, FileDown, FileText
} from 'lucide-react';
import {
  exportToExcel,
  getRegistrationDocuments,
  downloadDocument,
  downloadAllRegistrationDocuments,
} from '../lib/exportExcel';
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
import { resolveImageUrl } from '../../lib/utils';
import { ResourceForm } from '../components/ResourceForm';
import { ApplicationFormPrintView } from '../../components/ApplicationFormPrintView';
import { PageStatusBanner } from '../components/PageStatusBanner';
import { formatDate, truncate, cn } from '../lib/format';
import { apiClient } from '../api/client';

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
  const [accessMode, setAccessMode] = useState<'open' | 'authorized'>('authorized');
  const [togglingAccess, setTogglingAccess] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [downloadingDocsId, setDownloadingDocsId] = useState<string | null>(null);

  useEffect(() => {
    if (module.key === 'registrations' || module.key === 'applicants') {
      apiClient.get('/registration-settings')
        .then((res) => {
          if (res.data?.data?.accessMode) {
            setAccessMode(res.data.data.accessMode);
          }
        })
        .catch(() => {});
    }
  }, [module.key]);

  const handleToggleAccessMode = async () => {
    const nextMode = accessMode === 'open' ? 'authorized' : 'open';
    setTogglingAccess(true);
    try {
      await apiClient.put('/admin/registration-settings', { accessMode: nextMode });
      setAccessMode(nextMode);
      toast.success(`Registration access mode set to: ${nextMode === 'open' ? 'Open for All (Public)' : 'Authorized Only (Login Required)'}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update access mode');
    } finally {
      setTogglingAccess(false);
    }
  };

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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [module.key]);

  const openCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setDrawerOpen(true);
  };

  const handleExportXLS = async () => {
    setExporting(true);
    try {
      toast.info(`Preparing ${module.label} data for Excel export…`);
      const res = await listResource(module.resource, {
        limit: 5000,
        search: search || undefined,
        status: status || undefined,
        ...extraFilters,
      });
      exportToExcel(module.key, module.label, res.items);
      toast.success(`${module.label} exported to Excel (.xlsx) successfully!`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to export Excel');
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadAllDocs = async (registration: any) => {
    setDownloadingDocsId(registration._id);
    try {
      toast.info(`Downloading documents for ${registration.fullName || 'applicant'}…`);
      await downloadAllRegistrationDocuments(registration);
      toast.success('All documents downloaded successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to download documents');
    } finally {
      setDownloadingDocsId(null);
    }
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

  const onUpdateRegistrationStatus = async (newStatus: string) => {
    if (!preview?._id) return;
    try {
      await updateResource(module.resource, preview._id, { status: newStatus });
      toast.success(`Registration status updated to ${newStatus}`);
      setPreview((prev: any) => ({ ...prev, status: newStatus }));
      await load();
    } catch (e: any) {
      toast.error(e.message || 'Failed to update status');
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
            <Button
              variant="outline"
              onClick={handleExportXLS}
              loading={exporting}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 font-semibold cursor-pointer"
              title={`Download ${module.label} as Excel (XLS) spreadsheet`}
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <span>Export XLS</span>
            </Button>
            <Button variant="outline" onClick={load}><RefreshCw className="h-4 w-4" /> Refresh</Button>
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add {module.singular}</Button>
          </>
        }
      />

      {(() => {
        const modulePageKeyMap: Record<string, string> = {
          medicines: 'pharmacy',
          registrations: 'online-form',
          applicants: 'online-form',
          patients: 'reports',
          labreports: 'reports',
          downloads: 'downloads',
          news: 'news-events',
          announcements: 'news-events',
          careers: 'academic',
          departments: 'department',
        };
        const pageKey = modulePageKeyMap[module.key];
        return pageKey ? <PageStatusBanner pageKey={pageKey} /> : null;
      })()}

      {(module.key === 'registrations' || module.key === 'applicants') && (
        <div className="mb-5 p-4 rounded-2xl border bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-200">Online Registration Access Mode:</span>
              <span className={cn(
                "px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs",
                accessMode === 'open' ? "bg-emerald-500 text-white" : "bg-amber-400 text-amber-950"
              )}>
                {accessMode === 'open' ? "● Open for All (Public)" : "🔒 Authorized Only (Login Required)"}
              </span>
            </div>
            <p className="text-xs text-blue-100/80">
              {accessMode === 'open'
                ? "Anyone visiting the main website can freely open and fill out the online registration form."
                : "Restricted to pre-approved candidates. Visitors must log in with credentials created by Admin."}
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleToggleAccessMode}
            loading={togglingAccess}
            className={cn(
              "font-bold text-xs shrink-0 cursor-pointer shadow-sm border",
              accessMode === 'open'
                ? "bg-amber-400 hover:bg-amber-300 text-amber-950 border-amber-300"
                : "bg-emerald-500 hover:bg-emerald-400 text-white border-emerald-400"
            )}
          >
            {accessMode === 'open' ? "Switch to: 🔒 Authorized Only" : "Switch to: 🌐 Open for All"}
          </Button>
        </div>
      )}

      {module.key === 'medicines' && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => {
              setPage(1);
              setExtraFilters((prev) => {
                const next = { ...prev };
                delete next.stockStatus;
                return next;
              });
            }}
            className={`rounded-2xl border p-3.5 text-left transition shadow-xs ${
              !extraFilters.stockStatus
                ? 'border-brand-500 bg-brand-50/70 ring-2 ring-brand-200'
                : 'border-ink-100 bg-white hover:border-ink-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">All Medicines</span>
              <Pill className="h-4 w-4 text-brand-600" />
            </div>
            <p className="mt-1 font-display text-xl font-bold text-ink-900">{meta.total ?? items.length}</p>
            <p className="text-[10px] text-ink-400 mt-0.5">Click to view full catalog</p>
          </button>

          <button
            type="button"
            onClick={() => {
              setPage(1);
              setExtraFilters((prev) => {
                const next = { ...prev };
                if (prev.stockStatus === 'In Stock') {
                  delete next.stockStatus;
                } else {
                  next.stockStatus = 'In Stock';
                }
                return next;
              });
            }}
            className={`rounded-2xl border p-3.5 text-left transition shadow-xs ${
              extraFilters.stockStatus === 'In Stock'
                ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200'
                : 'border-ink-100 bg-white hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">In Stock</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-1 font-display text-xl font-bold text-emerald-800">
              {items.filter((i) => i.stockStatus === 'In Stock').length}
              <span className="text-xs font-normal text-emerald-600 ml-1">in page</span>
            </p>
            <p className="text-[10px] text-emerald-600/80 mt-0.5">🟢 Sufficient inventory</p>
          </button>

          <button
            type="button"
            onClick={() => {
              setPage(1);
              setExtraFilters((prev) => {
                const next = { ...prev };
                if (prev.stockStatus === 'Low Stock') {
                  delete next.stockStatus;
                } else {
                  next.stockStatus = 'Low Stock';
                }
                return next;
              });
            }}
            className={`rounded-2xl border p-3.5 text-left transition shadow-xs ${
              extraFilters.stockStatus === 'Low Stock'
                ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                : 'border-ink-100 bg-white hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Low Stock Alert</span>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <p className="mt-1 font-display text-xl font-bold text-amber-800">
              {items.filter((i) => i.stockStatus === 'Low Stock').length}
              <span className="text-xs font-normal text-amber-600 ml-1">in page</span>
            </p>
            <p className="text-[10px] text-amber-600/80 mt-0.5">🟠 Reorder needed soon</p>
          </button>

          <button
            type="button"
            onClick={() => {
              setPage(1);
              setExtraFilters((prev) => {
                const next = { ...prev };
                if (prev.stockStatus === 'Out of Stock') {
                  delete next.stockStatus;
                } else {
                  next.stockStatus = 'Out of Stock';
                }
                return next;
              });
            }}
            className={`rounded-2xl border p-3.5 text-left transition shadow-xs ${
              extraFilters.stockStatus === 'Out of Stock'
                ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-200'
                : 'border-ink-100 bg-white hover:border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Out of Stock</span>
              <AlertCircle className="h-4 w-4 text-rose-600" />
            </div>
            <p className="mt-1 font-display text-xl font-bold text-rose-800">
              {items.filter((i) => i.stockStatus === 'Out of Stock').length}
              <span className="text-xs font-normal text-rose-600 ml-1">in page</span>
            </p>
            <p className="text-[10px] text-rose-600/80 mt-0.5">🔴 Immediate restock</p>
          </button>
        </div>
      )}

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
                            <Badge
                              tone={
                                value === 'In Stock'
                                  ? 'success'
                                  : value === 'Low Stock'
                                    ? 'warning'
                                    : value === 'Out of Stock'
                                      ? 'danger'
                                      : 'brand'
                              }
                            >
                              {value === 'In Stock'
                                ? '● In Stock'
                                : value === 'Low Stock'
                                  ? '▲ Low Stock'
                                  : value === 'Out of Stock'
                                    ? '✕ Out of Stock'
                                    : value || '—'}
                            </Badge>
                          ) : col.key === 'rate' ? (
                            <span className="font-semibold text-ink-900 font-mono">Rs. {Number(value || 0).toFixed(2)}</span>
                          ) : (
                            <span className="text-ink-800">{truncate(String(value ?? '—'), 48)}</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {module.key === 'registrations' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPreview(item)}
                            title="View Official Application Form"
                            className="border-blue-200 text-blue-700 hover:bg-blue-50 font-bold text-xs flex items-center gap-1.5"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>View Form</span>
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => setPreview(item)} title="Preview Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {module.key === 'registrations' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadAllDocs(item)}
                            loading={downloadingDocsId === item._id}
                            title="Download All Candidate Documents (Photos, ID, Certs, Voucher)"
                            className="text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <FileDown className="h-4 w-4" />
                          </Button>
                        )}
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
          <Pagination page={meta.page} totalPages={meta.totalPages} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
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

      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title={
          module.key === 'registrations' && preview
            ? `Official Application Form — ${preview.registrationNumber || 'Pending'} (${preview.fullName || 'Candidate'})`
            : 'Preview'
        }
        wide={module.key !== 'registrations'}
        extraWide={module.key === 'registrations'}
      >
        {preview && module.key === 'registrations' ? (
          <ApplicationFormPrintView
            data={preview}
            isAdmin={true}
            onPrint={() => window.print()}
            onUpdateStatus={onUpdateRegistrationStatus}
            onDownloadAllDocs={() => handleDownloadAllDocs(preview)}
            downloadingDocs={downloadingDocsId === preview._id}
            docsList={getRegistrationDocuments(preview)}
            onDownloadSingleDoc={downloadDocument}
          />
        ) : preview ? (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-xl font-semibold text-ink-900">
                {preview.title || preview.name || preview.question || preview[titleKey]}
              </h3>
              {preview.status && <StatusBadge status={preview.status} />}
            </div>
            {preview.imageUrl || preview.url || preview.logoUrl ? (
              <img
                src={resolveImageUrl(preview.imageUrl || preview.url || preview.logoUrl)}
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
        ) : null}
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
