import { useEffect, useState } from 'react';
import { ImagePlus, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { listMedia, uploadMedia } from '../api/cmsApi';
import { Button, Input, Modal } from './ui';

export function MediaPicker({
  value,
  onChange,
  label = 'Select media',
  accept = 'image/*',
}: {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState('general');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    listMedia({ limit: 48, folder: folder === 'all' ? undefined : folder })
      .then((res) => setItems(res.items))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [open, folder]);

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploaded = await uploadMedia(files[0], folder === 'all' ? 'general' : folder);
      onChange(uploaded.url);
      toast.success('Uploaded');
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="https://… or /uploads/…" />
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          <ImagePlus className="h-4 w-4" /> Library
        </Button>
      </div>
      {value ? (
        <div className="overflow-hidden rounded-xl border border-ink-100 bg-ink-50">
          {/\.(mp4|webm|pdf)$/i.test(value) || value.includes('/document') ? (
            <div className="px-3 py-4 text-xs text-ink-500">{value}</div>
          ) : (
            <img src={value} alt="" className="h-28 w-full object-cover" />
          )}
        </div>
      ) : null}

      <Modal open={open} onClose={() => setOpen(false)} title={label} wide>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Input
            value={folder}
            onChange={(e) => setFolder(e.target.value || 'general')}
            className="max-w-[180px]"
            placeholder="folder"
          />
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm hover:bg-ink-50">
            <Upload className="h-4 w-4" />
            {uploading ? 'Uploading…' : 'Upload new'}
            <input type="file" accept={accept} className="hidden" onChange={(e) => onUpload(e.target.files)} />
          </label>
        </div>
        {loading ? (
          <div className="py-10 text-center text-sm text-ink-500">Loading media…</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => {
                  onChange(item.url);
                  setOpen(false);
                }}
                className="overflow-hidden rounded-xl border border-ink-100 bg-ink-50 text-left transition hover:border-brand-400 hover:shadow-md"
              >
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.alt || item.originalName} className="h-28 w-full object-cover" />
                ) : (
                  <div className="flex h-28 items-center justify-center px-2 text-center text-xs text-ink-500">
                    {item.originalName}
                  </div>
                )}
                <div className="truncate px-2 py-1.5 text-[11px] text-ink-600">{item.originalName}</div>
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
