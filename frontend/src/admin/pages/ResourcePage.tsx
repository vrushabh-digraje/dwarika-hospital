import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ExternalLink, Pencil, Plus, RefreshCw, Search, Trash2, Eye, Pill, CheckCircle2, AlertTriangle, AlertCircle,
  User, MapPin, CreditCard, GraduationCap
} from 'lucide-react';
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
import { formatDate, truncate, cn } from '../lib/format';

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
            <Button variant="outline" onClick={load}><RefreshCw className="h-4 w-4" /> Refresh</Button>
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add {module.singular}</Button>
          </>
        }
      />

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

      <Modal open={!!preview} onClose={() => setPreview(null)} title={module.key === 'registrations' ? 'Applicant Registration Details' : 'Preview'} wide>
        {preview && module.key === 'registrations' ? (
          <div className="space-y-6 text-sm">
            {/* Applicant Header Strip */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-md">
              <div className="flex items-center gap-4">
                {preview.photoUrl ? (
                  <img
                    src={resolveImageUrl(preview.photoUrl)}
                    alt={preview.fullName}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/30 bg-white/10"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-white ring-2 ring-white/20">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black tracking-tight">{preview.fullName}</h3>
                    {preview.fullNameNp && (
                      <span className="text-xs text-blue-200 font-semibold">({preview.fullNameNp})</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                    <span className="font-mono bg-white/20 text-white font-bold px-2 py-0.5 rounded-lg text-[11px]">
                      {preview.registrationNumber || 'No Reg No'}
                    </span>
                    <span className="bg-blue-800/80 px-2 py-0.5 rounded-lg text-[11px] font-semibold text-blue-100">
                      {preview.entryYear || '2082 B.S.'}
                    </span>
                    {preview.postApplied && (
                      <span className="text-blue-200 font-medium">Applied: <strong className="text-white">{preview.postApplied}</strong></span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                  preview.status === 'approved' ? 'bg-emerald-500 text-white' :
                  preview.status === 'verified' ? 'bg-blue-500 text-white' :
                  preview.status === 'rejected' ? 'bg-rose-500 text-white' :
                  'bg-amber-400 text-amber-950'
                )}>
                  ● {preview.status || 'Pending'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onUpdateRegistrationStatus('verified')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold transition"
                    title="Mark as Verified"
                  >
                    Verify
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateRegistrationStatus('approved')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
                    title="Approve Application"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateRegistrationStatus('rejected')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white font-semibold transition"
                    title="Reject Application"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>

            {/* Grid of Applicant Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Personal & Family */}
              <div className="p-4 rounded-2xl border border-ink-100 bg-ink-50/50 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-ink-900 border-b border-ink-100 pb-2">
                  <User className="w-4 h-4 text-brand-600" />
                  <span>Personal & Family Details</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-ink-400 font-bold uppercase">Father's Name</span>
                    <p className="font-semibold text-ink-800">{preview.fatherName || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-400 font-bold uppercase">Mother's Name</span>
                    <p className="font-semibold text-ink-800">{preview.motherName || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-400 font-bold uppercase">DOB (AD / BS)</span>
                    <p className="font-semibold text-ink-800">{preview.dobAD || '—'} / {preview.dobBS || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-400 font-bold uppercase">Gender / Blood Group</span>
                    <p className="font-semibold text-ink-800">{preview.gender || '—'} ({preview.bloodGroup || '—'})</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-400 font-bold uppercase">Citizenship No.</span>
                    <p className="font-semibold text-ink-800">{preview.citizenshipNo || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-400 font-bold uppercase">Issue Date / Place</span>
                    <p className="font-semibold text-ink-800">{preview.citizenshipIssueDate || '—'} ({preview.citizenshipIssuePlace || '—'})</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-400 font-bold uppercase">Marital / Religion</span>
                    <p className="font-semibold text-ink-800">{preview.maritalStatus || '—'} • {preview.religion || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-400 font-bold uppercase">Grandfather / Spouse</span>
                    <p className="font-semibold text-ink-800">{preview.grandfatherName || '—'} / {preview.spouseName || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Contact & Address */}
              <div className="p-4 rounded-2xl border border-ink-100 bg-ink-50/50 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-ink-900 border-b border-ink-100 pb-2">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  <span>Contact & Address</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-ink-400 font-bold uppercase">Mobile Number</span>
                      <p className="font-semibold text-brand-700">{preview.mobile || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-400 font-bold uppercase">Email Address</span>
                      <p className="font-semibold text-ink-800">{preview.email || '—'}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-400 font-bold uppercase">Permanent Address</span>
                    <p className="font-semibold text-ink-800">
                      {[
                        preview.permanentAddress?.street,
                        preview.permanentAddress?.ward ? `Ward ${preview.permanentAddress.ward}` : '',
                        preview.permanentAddress?.municipality,
                        preview.permanentAddress?.district,
                        preview.permanentAddress?.province,
                        preview.permanentAddress?.country || 'Nepal',
                      ].filter(Boolean).join(', ') || '—'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-400 font-bold uppercase">Mailing Address</span>
                    <p className="font-semibold text-ink-800">
                      {[
                        preview.mailingAddress?.street,
                        preview.mailingAddress?.ward ? `Ward ${preview.mailingAddress.ward}` : '',
                        preview.mailingAddress?.municipality,
                        preview.mailingAddress?.district,
                        preview.mailingAddress?.foreignAddress,
                      ].filter(Boolean).join(', ') || 'Same as Permanent'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Payment & Voucher Verification */}
              <div className="p-4 rounded-2xl border border-sky-100 bg-sky-50/40 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-sky-950 border-b border-sky-100 pb-2">
                  <CreditCard className="w-4 h-4 text-sky-600" />
                  <span>Payment & Fee Verification</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-sky-600 font-bold uppercase">Payment Mode</span>
                    <p className="font-semibold text-ink-900">{preview.payment?.mode || 'eSewa / QR / Bank'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-sky-600 font-bold uppercase">Voucher / Txn No.</span>
                    <p className="font-bold text-brand-700 font-mono text-sm">{preview.paymentVoucherNo || preview.payment?.voucherNo || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-sky-600 font-bold uppercase">Payment Date</span>
                    <p className="font-semibold text-ink-900">{preview.payment?.paymentDate || '—'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-sky-600 font-bold uppercase">Submitted Date</span>
                    <p className="font-semibold text-ink-900">{formatDate(preview.createdAt)}</p>
                  </div>
                </div>

                {(preview.paymentVoucherUrl || preview.payment?.voucherUrl) && (
                  <div className="pt-2">
                    <span className="text-[10px] text-sky-700 font-bold uppercase block mb-1">Attached Voucher Screenshot</span>
                    <a
                      href={resolveImageUrl(preview.paymentVoucherUrl || preview.payment?.voucherUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group relative overflow-hidden rounded-xl border border-sky-200 bg-white"
                    >
                      <img
                        src={resolveImageUrl(preview.paymentVoucherUrl || preview.payment?.voucherUrl)}
                        alt="Payment Voucher"
                        className="max-h-48 w-full object-contain p-2 group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                        <ExternalLink className="w-4 h-4" /> Open Full Image
                      </div>
                    </a>
                  </div>
                )}
              </div>

              {/* Card 4: Council & Qualifications */}
              <div className="p-4 rounded-2xl border border-ink-100 bg-ink-50/50 space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-ink-900 border-b border-ink-100 pb-2">
                  <GraduationCap className="w-4 h-4 text-brand-600" />
                  <span>Council & Qualifications</span>
                </div>
                <div className="space-y-2 text-xs">
                  {preview.councilDetails?.councilName && (
                    <div className="p-2.5 rounded-xl bg-white border border-ink-100">
                      <span className="text-[10px] text-ink-400 font-bold uppercase">Council Registration</span>
                      <p className="font-semibold text-ink-900">
                        {preview.councilDetails.councilName} • Reg: {preview.councilDetails.regNo || '—'}
                      </p>
                    </div>
                  )}

                  {Array.isArray(preview.academicDetails) && preview.academicDetails.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-ink-400 font-bold uppercase">Academic Entries ({preview.academicDetails.length})</span>
                      <div className="divide-y divide-ink-100 border border-ink-100 rounded-xl bg-white overflow-hidden">
                        {preview.academicDetails.map((ac: any, idx: number) => (
                          <div key={idx} className="p-2 flex items-center justify-between text-[11px]">
                            <div>
                              <strong className="text-ink-900">{ac.level}</strong>
                              <span className="text-ink-500 ml-1.5">{ac.school || ac.university || '—'}</span>
                            </div>
                            <span className="font-mono text-brand-700 font-bold">{ac.markGpa || ac.division || 'Passed'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-ink-500 pt-1">
                    <span>Trainings: <strong>{preview.trainingEntries?.length || 0}</strong></span>
                    <span>Experience: <strong>{preview.workEntries?.length || 0}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {preview.adminRemarks && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                <strong className="text-amber-900">Admin Remarks:</strong>
                <p className="text-amber-800 mt-0.5">{preview.adminRemarks}</p>
              </div>
            )}
          </div>
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
