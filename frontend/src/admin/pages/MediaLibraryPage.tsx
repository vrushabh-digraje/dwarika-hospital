import { useCallback, useEffect, useState } from 'react';
import { FolderPlus, RefreshCw, Replace, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import {
  deleteMedia,
  getMediaFolders,
  listMedia,
  replaceMedia,
  updateMediaMeta,
  uploadManyMedia,
} from '../api/cmsApi';
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Input,
  LoadingBlock,
  PageHeader,
  Pagination,
} from '../components/ui';
import { formatDate } from '../lib/format';

export default function MediaLibraryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [folders, setFolders] = useState<{ name: string; count: number }[]>([]);
  const [folder, setFolder] = useState('general');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0, limit: 24, hasNext: false, hasPrev: false });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [deleting, setDeleting] = useState<any | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [media, folderList] = await Promise.all([
        listMedia({ page, limit: 24, folder: folder || undefined, search: search || undefined }),
        getMediaFolders(),
      ]);
      setItems(media.items);
      setMeta(media.meta);
      setFolders(folderList);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, folder, search]);

  useEffect(() => {
    load();
  }, [load]);

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return;
    setUploading(true);
    try {
      await uploadManyMedia(list, folder || 'general');
      toast.success(`${list.length} file(s) uploaded`);
      await load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const onReplace = async (file: File | null) => {
    if (!file || !selected) return;
    try {
      const updated = await replaceMedia(selected._id, file);
      setSelected(updated);
      toast.success('Media replaced');
      await load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const onSaveMeta = async () => {
    if (!selected) return;
    try {
      const updated = await updateMediaMeta(selected._id, {
        title: selected.title,
        alt: selected.alt,
        folder: selected.folder,
      });
      setSelected(updated);
      toast.success('Media updated');
      await load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const onDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMedia(deleting._id);
      toast.success('Media deleted');
      setDeleting(null);
      if (selected?._id === deleting._id) setSelected(null);
      await load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Upload, organize, preview, replace, and reuse optimized media assets."
        breadcrumbs={[{ label: 'CMS' }, { label: 'Media Library' }]}
        actions={
          <>
            <Button variant="outline" onClick={load}><RefreshCw className="h-4 w-4" /> Refresh</Button>
            <Button
              variant="primary"
              loading={uploading}
              onClick={() => document.getElementById('media-upload-file-input')?.click()}
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
            <input
              id="media-upload-file-input"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && uploadFiles(e.target.files)}
            />
          </>
        }
      />

      <div className="mb-4 grid gap-3 lg:grid-cols-[220px_1fr]">
        <Card className="p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
            <FolderPlus className="h-3.5 w-3.5" /> Folders
          </div>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => { setFolder(''); setPage(1); }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm ${!folder ? 'bg-brand-50 text-brand-800' : 'hover:bg-ink-50'}`}
            >
              <span>All</span>
            </button>
            {['general', ...folders.map((f) => f.name).filter((n) => n !== 'general')].filter((v, i, a) => a.indexOf(v) === i).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => { setFolder(name); setPage(1); }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm ${folder === name ? 'bg-brand-50 text-brand-800' : 'hover:bg-ink-50'}`}
              >
                <span>{name}</span>
                <Badge tone="neutral">{folders.find((f) => f.name === name)?.count || 0}</Badge>
              </button>
            ))}
          </div>
          <div className="mt-3">
            <Input
              placeholder="New / current folder"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
            />
          </div>
        </Card>

        <div className="space-y-4">
          <Card
            className={`border-dashed p-6 text-center transition ${dragOver ? 'border-brand-400 bg-brand-50/50' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
            }}
          >
            <Upload className="mx-auto mb-2 h-6 w-6 text-brand-600" />
            <div className="text-sm font-medium text-ink-800">Drag & drop files here</div>
            <div className="mt-1 text-xs text-ink-500">Images are auto-optimized to WebP on upload.</div>
          </Card>

          <Card className="p-3">
            <Input
              placeholder="Search media…"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            />
          </Card>

          {loading ? (
            <LoadingBlock />
          ) : items.length === 0 ? (
            <EmptyState title="No media yet" description="Upload images, PDFs, or videos to reuse across the CMS." />
          ) : (
            <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
              <Card className="overflow-hidden">
                <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 md:grid-cols-4">
                  {items.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => setSelected(item)}
                      className={`overflow-hidden rounded-xl border text-left transition ${selected?._id === item._id ? 'border-brand-500 ring-2 ring-brand-100' : 'border-ink-100 hover:border-brand-300'}`}
                    >
                      {item.type === 'image' ? (
                        <img src={item.url} alt={item.alt || item.originalName} className="h-28 w-full object-cover" />
                      ) : (
                        <div className="flex h-28 items-center justify-center bg-ink-50 px-2 text-center text-xs text-ink-500">
                          {item.originalName}
                        </div>
                      )}
                      <div className="truncate px-2 py-1.5 text-[11px]">{item.originalName}</div>
                    </button>
                  ))}
                </div>
                <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} />
              </Card>

              <Card className="p-4">
                {selected ? (
                  <div className="space-y-3">
                    {selected.type === 'image' ? (
                      <img src={selected.url} alt="" className="max-h-48 w-full rounded-xl object-cover" />
                    ) : (
                      <div className="rounded-xl bg-ink-50 p-4 text-xs text-ink-600 break-all">{selected.url}</div>
                    )}
                    <div>
                      <div className="text-xs font-semibold uppercase text-ink-400">Title</div>
                      <Input value={selected.title || ''} onChange={(e) => setSelected({ ...selected, title: e.target.value })} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase text-ink-400">Alt</div>
                      <Input value={selected.alt || ''} onChange={(e) => setSelected({ ...selected, alt: e.target.value })} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase text-ink-400">Folder</div>
                      <Input value={selected.folder || ''} onChange={(e) => setSelected({ ...selected, folder: e.target.value })} />
                    </div>
                    <div className="text-xs text-ink-400">
                      {selected.mimeType} · {(selected.size / 1024).toFixed(1)} KB
                      {selected.optimized ? ' · Optimized' : ''}
                      <div>Updated {formatDate(selected.updatedAt)}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onClick={onSaveMeta}>Save</Button>
                      <label className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-ink-200 px-3 py-2 text-xs font-medium hover:bg-ink-50">
                        <Replace className="h-3.5 w-3.5" /> Replace
                        <input type="file" className="hidden" onChange={(e) => onReplace(e.target.files?.[0] || null)} />
                      </label>
                      <Button size="sm" variant="danger" onClick={() => setDeleting(selected)}>
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(selected.url);
                        toast.success('URL copied');
                      }}
                    >
                      Copy URL
                    </Button>
                  </div>
                ) : (
                  <div className="py-10 text-center text-sm text-ink-500">Select a file to preview and edit.</div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={onDelete}
        title="Delete media?"
        message="This will permanently remove the file from the library."
      />
    </div>
  );
}
