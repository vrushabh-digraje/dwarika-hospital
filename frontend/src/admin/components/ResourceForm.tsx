import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { FieldConfig, ModuleConfig } from '../config/modules';
import { Button, Input, Label, Select, Textarea } from './ui';
import { RichTextEditor } from './RichTextEditor';
import { MediaPicker } from './MediaPicker';
import { Plus, Trash2 } from 'lucide-react';

function MultiImagePicker({
  value = [],
  onChange,
}: {
  value?: string[];
  onChange: (urls: string[]) => void;
}) {
  const images = Array.isArray(value) ? value : [];

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, newUrl: string) => {
    const updated = [...images];
    updated[index] = newUrl;
    onChange(updated);
  };

  return (
    <div className="space-y-3 p-3.5 rounded-2xl border border-ink-200 bg-ink-50/50">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ink-600">
          {images.length} {images.length === 1 ? 'photo' : 'photos'} in album
        </span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onChange([...images, ''])}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Photo
        </Button>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-6 text-xs text-ink-400 border border-dashed border-ink-200 rounded-xl bg-white">
          No related album photos added yet. Click &quot;Add Photo&quot; to attach photos to this gallery item.
        </div>
      ) : (
        <div className="space-y-2.5">
          {images.map((url, i) => (
            <div key={i} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-ink-200">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-ink-100 flex-shrink-0 border border-ink-200">
                {url ? (
                  <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink-300 text-xs font-bold">
                    #{i + 1}
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <MediaPicker
                  value={url}
                  onChange={(newUrl) => handleUpdate(i, newUrl)}
                  label="Pick photo"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Remove photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function buildSchema(fields: FieldConfig[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  fields.forEach((field) => {
    let schema: z.ZodTypeAny;
    switch (field.type) {
      case 'number':
        schema = z.coerce.number().optional();
        break;
      case 'toggle':
        schema = z.boolean().optional();
        break;
      case 'tags':
        schema = z.union([z.string(), z.array(z.string())]).optional();
        break;
      case 'images':
        schema = z.array(z.string()).optional();
        break;
      case 'status':
        schema = z.enum(['draft', 'published']).optional();
        break;
      default:
        schema = field.required ? z.string().min(1, `${field.label} is required`) : z.string().optional();
    }
    shape[field.name] = schema;
  });
  return z.object(shape);
}

function normalizeOutgoing(fields: FieldConfig[], values: Record<string, any>) {
  const out = { ...values };
  fields.forEach((field) => {
    if (field.type === 'tags') {
      const v = out[field.name];
      if (typeof v === 'string') {
        out[field.name] = v
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    if (field.type === 'images') {
      const v = out[field.name];
      if (Array.isArray(v)) {
        out[field.name] = v.map((s) => String(s || '').trim()).filter(Boolean);
      } else if (typeof v === 'string') {
        out[field.name] = v.split('\n').map((s) => s.trim()).filter(Boolean);
      } else {
        out[field.name] = [];
      }
    }
    if (field.type === 'number' && (out[field.name] === '' || out[field.name] === undefined)) {
      delete out[field.name];
    }
  });
  return out;
}

function normalizeIncoming(fields: FieldConfig[], values: Record<string, any> = {}) {
  const out = { ...values };
  fields.forEach((field) => {
    if (field.type === 'images') {
      if (!Array.isArray(out[field.name])) {
        out[field.name] = typeof out[field.name] === 'string' && out[field.name] ? [out[field.name]] : [];
      }
    }
    if (field.type === 'tags' && Array.isArray(out[field.name])) {
      out[field.name] = out[field.name].join(', ');
    }
    if (field.type === 'date' && out[field.name]) {
      out[field.name] = String(out[field.name]).slice(0, 10);
    }
    if (field.type === 'toggle' && out[field.name] === undefined) {
      out[field.name] = false;
    }
    if (field.type === 'status' && !out[field.name]) {
      out[field.name] = 'draft';
    }
  });
  return out;
}

export function ResourceForm({
  module,
  initialValues,
  onSubmit,
  onCancel,
  loading,
}: {
  module: ModuleConfig;
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => Promise<void> | void;
  onCancel: () => void;
  loading?: boolean;
}) {
  const schema = buildSchema(module.fields);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: normalizeIncoming(module.fields, initialValues),
  });

  useEffect(() => {
    form.reset(normalizeIncoming(module.fields, initialValues));
  }, [initialValues, module.key]);

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(normalizeOutgoing(module.fields, values as Record<string, any>));
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {module.fields.map((field) => (
          <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
            <Label>{field.label}{field.required ? ' *' : ''}</Label>
            <Controller
              name={field.name as any}
              control={form.control}
              render={({ field: rhf }) => {
                if (field.type === 'textarea') {
                  return <Textarea {...rhf} rows={field.rows || 4} placeholder={field.placeholder} />;
                }
                if (field.type === 'richtext') {
                  return <RichTextEditor value={rhf.value} onChange={rhf.onChange} placeholder={field.placeholder} />;
                }
                if (field.type === 'select') {
                  return (
                    <Select {...rhf} value={rhf.value || ''}>
                      <option value="">Select…</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Select>
                  );
                }
                if (field.type === 'status') {
                  return (
                    <Select {...rhf} value={rhf.value || 'draft'}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </Select>
                  );
                }
                if (field.type === 'toggle') {
                  return (
                    <label className="flex h-10 items-center gap-2 rounded-xl border border-ink-200 px-3 text-sm">
                      <input
                        type="checkbox"
                        checked={!!rhf.value}
                        onChange={(e) => rhf.onChange(e.target.checked)}
                        className="h-4 w-4 accent-brand-600"
                      />
                      Enabled
                    </label>
                  );
                }
                if (field.type === 'image') {
                  return <MediaPicker value={rhf.value} onChange={rhf.onChange} />;
                }
                if (field.type === 'images') {
                  return <MultiImagePicker value={rhf.value || []} onChange={rhf.onChange} />;
                }
                if (field.type === 'file') {
                  return <MediaPicker value={rhf.value} onChange={rhf.onChange} label="Select file" accept="*/*" />;
                }
                if (field.type === 'number') {
                  return <Input type="number" {...rhf} value={rhf.value ?? ''} />;
                }
                if (field.type === 'date') {
                  return <Input type="date" {...rhf} value={rhf.value || ''} />;
                }
                return <Input {...rhf} value={rhf.value || ''} placeholder={field.placeholder} />;
              }}
            />
            {form.formState.errors[field.name] && (
              <p className="mt-1 text-xs text-red-600">
                {(form.formState.errors[field.name]?.message as string) || 'Invalid'}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>Save</Button>
      </div>
    </form>
  );
}
