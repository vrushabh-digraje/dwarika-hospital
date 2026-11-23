import { useEffect, useState, useRef, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { FieldConfig, ModuleConfig } from '../config/modules';
import { apiClient } from '../api/client';
import { Button, Input, Label, Select, Textarea } from './ui';
import { RichTextEditor } from './RichTextEditor';
import { MediaPicker } from './MediaPicker';
import { Plus, Trash2, Pill, Calculator, AlertTriangle, CheckCircle, Ban, FileText, Search, ChevronDown, Check, X, Stethoscope } from 'lucide-react';
import { doctors as fallbackDoctors } from '../../lib/teamData';
import { cn } from '../lib/format';

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


function CreatableSelectField({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: any;
  onChange: (v: any) => void;
}) {
  const isPreset = field.options?.some((opt) => opt.value === value);
  const isExistingCustom = Boolean(value && !isPreset);
  const [isCustom, setIsCustom] = useState(isExistingCustom);

  useEffect(() => {
    if (value && !field.options?.some((opt) => opt.value === value)) {
      setIsCustom(true);
    }
  }, [value, field.options]);

  const selectValue = isCustom ? '__custom__' : (value || '');

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-ink-400">
          {isCustom ? '✍️ Type New / Custom Category' : '📋 Choose from existing list'}
        </span>
        <button
          type="button"
          onClick={() => {
            const nextCustom = !isCustom;
            setIsCustom(nextCustom);
            if (!nextCustom) {
              onChange('');
            }
          }}
          className="text-xs font-bold text-brand-700 hover:text-brand-900 hover:underline cursor-pointer flex items-center gap-1"
        >
          {isCustom ? '← Choose from list' : '✍️ + Type new / custom'}
        </button>
      </div>

      {!isCustom ? (
        <Select
          value={selectValue}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '__custom__') {
              setIsCustom(true);
              onChange('');
            } else {
              setIsCustom(false);
              onChange(val);
            }
          }}
        >
          <option value="">Select {field.label}…</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
          <option value="__custom__">➕ + Type New / Custom {field.label}…</option>
        </Select>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Type new ${field.label.toLowerCase()} (e.g. Physiotherapy Staff, Accounts)...`}
            autoFocus
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => {
              setIsCustom(false);
              onChange('');
            }}
            className="px-3 py-2 text-xs font-bold text-ink-600 hover:text-ink-900 bg-ink-100 hover:bg-ink-200 rounded-xl transition cursor-pointer shrink-0"
            title="Cancel custom typing and choose from preset dropdown"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}


function PermissionCheckboxesField({
  options = [],
  value = [],
  onChange,
}: {
  options?: { label: string; value: string }[];
  value?: string[];
  onChange: (val: string[]) => void;
}) {
  const current = Array.isArray(value) ? value : [];

  const toggle = (val: string) => {
    if (current.includes(val)) {
      onChange(current.filter((item) => item !== val));
    } else {
      onChange([...current, val]);
    }
  };

  const selectAll = () => {
    onChange(options.map((opt) => opt.value));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-ink-200 bg-ink-50/60 p-4">
      <div className="flex items-center justify-between pb-2 border-b border-ink-200/60">
        <span className="text-xs font-bold text-ink-700">
          Allowed Sections: <strong className="text-brand-700 font-mono">{current.length}</strong> of {options.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-[11px] font-bold text-brand-700 hover:text-brand-900 bg-white px-2.5 py-1 rounded-lg border border-brand-200 shadow-2xs hover:bg-brand-50 transition cursor-pointer"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] font-bold text-ink-600 hover:text-ink-900 bg-white px-2.5 py-1 rounded-lg border border-ink-200 shadow-2xs hover:bg-ink-100 transition cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
        {options.map((opt) => {
          const isChecked = current.includes(opt.value);
          return (
            <label
              key={opt.value}
              className={cn(
                'flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition select-none',
                isChecked
                  ? 'bg-brand-50/80 border-brand-400 text-brand-950 ring-1 ring-brand-300 shadow-xs'
                  : 'bg-white border-ink-200 text-ink-700 hover:border-ink-300'
              )}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(opt.value)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-ink-300"
              />
              <span className="truncate">{opt.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function AgeInputField({
  value,
  onChange,
  placeholder,
}: {
  value: any;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const parseVal = (raw: any) => {
    const str = String(raw ?? '').trim();
    if (!str) return { num: '', unit: 'Years' };
    const numMatch = str.match(/^(\d+)/);
    const num = numMatch ? numMatch[1] : '';
    let unit = 'Years';
    if (/(month|mo|महिना)/i.test(str)) {
      unit = 'Months';
    } else if (/(day|दिन)/i.test(str)) {
      unit = 'Days';
    } else if (/(year|yr|वर्ष)/i.test(str)) {
      unit = 'Years';
    }
    return { num, unit };
  };

  const initial = parseVal(value);
  const [numVal, setNumVal] = useState(initial.num);
  const [unitVal, setUnitVal] = useState(initial.unit);

  useEffect(() => {
    const p = parseVal(value);
    setNumVal(p.num);
    setUnitVal(p.unit);
  }, [value]);

  const update = (newNum: string, newUnit: string) => {
    setNumVal(newNum);
    setUnitVal(newUnit);
    if (!newNum.trim()) {
      onChange('');
    } else {
      onChange(`${newNum.trim()} ${newUnit}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        min="0"
        max="150"
        value={numVal}
        onChange={(e) => update(e.target.value, unitVal)}
        placeholder={placeholder || 'e.g. 28'}
        className="flex-1"
      />
      <Select
        value={unitVal}
        onChange={(e) => update(numVal, e.target.value)}
        className="w-36 shrink-0 bg-white font-medium"
      >
        <option value="Years">Years (Yrs)</option>
        <option value="Months">Months (Mos)</option>
        <option value="Days">Days</option>
      </Select>
    </div>
  );
}

function DoctorSelectField({
  value,
  onChange,
  placeholder,
}: {
  value: any;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [doctorsList, setDoctorsList] = useState<Array<{ name: string; specialty?: string; category?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [isTypingCustom, setIsTypingCustom] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    apiClient
      .get('/doctors', { params: { limit: 200 } })
      .then((res) => {
        if (!mounted) return;
        const apiDocs = (res.data?.data?.items || res.data?.items || res.data?.data || []).map((d: any) => ({
          name: d.name,
          specialty: d.specialty || d.specialization || d.designation || '',
          category: d.category || d.teamCategory || '',
        }));

        const mergedMap = new Map<string, { name: string; specialty?: string; category?: string }>();
        apiDocs.forEach((d: any) => {
          if (d.name) mergedMap.set(d.name.trim().toLowerCase(), d);
        });
        fallbackDoctors.forEach((d) => {
          const key = d.name.trim().toLowerCase();
          if (!mergedMap.has(key)) {
            mergedMap.set(key, { name: d.name, specialty: d.specialty, category: d.category });
          }
        });

        setDoctorsList(Array.from(mergedMap.values()));
      })
      .catch(() => {
        if (!mounted) return;
        setDoctorsList(
          fallbackDoctors.map((d) => ({
            name: d.name,
            specialty: d.specialty,
            category: d.category,
          }))
        );
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredDoctors = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return doctorsList;
    return doctorsList.filter((d) =>
      d.name.toLowerCase().includes(q) ||
      (d.specialty && d.specialty.toLowerCase().includes(q)) ||
      (d.category && d.category.toLowerCase().includes(q))
    );
  }, [doctorsList, search]);

  const hasExactMatch = useMemo(() => {
    const q = search.trim().toLowerCase();
    return doctorsList.some((d) => d.name.trim().toLowerCase() === q);
  }, [doctorsList, search]);

  const handleSelect = (name: string) => {
    onChange(name);
    setIsOpen(false);
    setSearch('');
    setIsTypingCustom(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {isTypingCustom ? (
        <div className="flex items-center gap-2">
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type doctor name (e.g. Dr. Suman Bhusal)..."
            autoFocus
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => {
              setIsTypingCustom(false);
            }}
            className="px-3 py-2 text-xs font-bold text-ink-600 hover:text-ink-900 bg-ink-100 hover:bg-ink-200 rounded-xl transition cursor-pointer shrink-0"
            title="Switch back to doctors list"
          >
            ← List
          </button>
        </div>
      ) : (
        <div>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full h-10 px-3.5 py-2 text-sm bg-white border border-ink-200 hover:border-ink-300 rounded-xl cursor-pointer shadow-xs transition select-none"
          >
            <div className="flex items-center gap-2 truncate">
              <Stethoscope className="w-4 h-4 text-brand-600 shrink-0" />
              {value ? (
                <span className="font-semibold text-ink-900 truncate">{value}</span>
              ) : (
                <span className="text-ink-400 truncate">{placeholder || 'Select Consultant / Referring Doctor…'}</span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              {value && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange('');
                  }}
                  className="p-1 text-ink-400 hover:text-ink-700 hover:bg-ink-100 rounded-full transition"
                  title="Clear doctor"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <ChevronDown className={cn('w-4 h-4 text-ink-400 transition-transform duration-200', isOpen && 'rotate-180')} />
            </div>
          </div>

          {isOpen && (
            <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-ink-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="p-2.5 border-b border-ink-100 bg-ink-50/60 sticky top-0 z-10 flex items-center gap-2">
                <Search className="w-4 h-4 text-ink-400 shrink-0 ml-1" />
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search doctor by name or specialty..."
                  className="w-full text-xs font-medium bg-transparent border-none outline-none text-ink-800 placeholder:text-ink-400"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="p-1 text-ink-400 hover:text-ink-700 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {search.trim() && !hasExactMatch && (
                <div
                  onClick={() => handleSelect(search.trim())}
                  className="p-2.5 mx-2 my-1 rounded-xl bg-brand-50 border border-brand-200 hover:bg-brand-100 cursor-pointer text-xs font-bold text-brand-800 flex items-center gap-2 transition"
                >
                  <Plus className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span className="truncate">Use &quot;{search.trim()}&quot; (Custom / Referring Doctor)</span>
                </div>
              )}

              <div className="max-h-60 overflow-y-auto p-1 divide-y divide-ink-50">
                {filteredDoctors.length === 0 && !search.trim() ? (
                  <div className="p-4 text-center text-xs text-ink-400">
                    {loading ? 'Loading doctors…' : 'No doctors found in directory.'}
                  </div>
                ) : filteredDoctors.length === 0 && search.trim() ? (
                  <div className="p-3 text-center text-xs text-ink-400">
                    No directory doctor matches &quot;{search}&quot;. Click above to use it as custom doctor.
                  </div>
                ) : (
                  filteredDoctors.map((doc, idx) => {
                    const isSelected = value === doc.name;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelect(doc.name)}
                        className={cn(
                          'flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition text-xs',
                          isSelected
                            ? 'bg-brand-50 text-brand-900 font-bold'
                            : 'hover:bg-ink-50 text-ink-800'
                        )}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold truncate text-ink-900">{doc.name}</p>
                          {(doc.specialty || doc.category) && (
                            <p className="text-[11px] text-ink-500 truncate">
                              {[doc.specialty, doc.category].filter(Boolean).join(' • ')}
                            </p>
                          )}
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-brand-600 shrink-0" />}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-2 border-t border-ink-100 bg-ink-50/40 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsTypingCustom(true);
                    setIsOpen(false);
                  }}
                  className="text-brand-700 hover:text-brand-900 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Type other doctor manually
                </button>
                <span className="text-[10px] text-ink-400">
                  {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
                </span>
              </div>
            </div>
          )}
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
      case 'permissions':
        schema = z.array(z.string()).optional();
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
    if (out.masterId && !out.patientUsername) {
    out.patientUsername = out.masterId;
  }
  // Sync name & brandName for medicines
  if (out.name && !out.brandName) {
    out.brandName = out.name;
  } else if (out.brandName && !out.name) {
    out.name = out.brandName;
  }
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
    if (field.type === 'permissions') {
      out[field.name] = Array.isArray(out[field.name]) ? out[field.name] : [];
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
    if (field.type === 'permissions') {
      out[field.name] = Array.isArray(out[field.name]) ? out[field.name] : [];
    }
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
      out[field.name] = 'published';
    }
    if (field.name === 'group' && !out[field.name]) {
      out[field.name] = 'Medicine';
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

    const isLabReport = module.key === 'labreports';
  const watchMasterId = form.watch('masterId');
  const [patientLookup, setPatientLookup] = useState<{
    loading: boolean;
    foundPatient?: any;
    error?: string;
  }>({ loading: false });

  // Auto-fill patient details in Lab Report when Master ID is entered
  useEffect(() => {
    if (!isLabReport) return;
    const trimmedId = String(watchMasterId || '').trim();
    if (!trimmedId || trimmedId.length < 2) {
      setPatientLookup({ loading: false });
      return;
    }

    const timer = setTimeout(async () => {
      setPatientLookup({ loading: true });
      try {
        const res = await apiClient.get(`/admin/patients/by-master-id/${encodeURIComponent(trimmedId)}`);
        const patient = res.data?.data;
        if (patient) {
          setPatientLookup({ loading: false, foundPatient: patient });
          if (patient.name) {
            form.setValue('patientName', patient.name, { shouldValidate: true, shouldDirty: true });
          }
          if (patient.age) {
            form.setValue('age', patient.age, { shouldValidate: true, shouldDirty: true });
          }
          if (patient.address) {
            form.setValue('address', patient.address, { shouldValidate: true, shouldDirty: true });
          }
          if (patient.doctorName) {
            form.setValue('doctorName', patient.doctorName, { shouldValidate: true, shouldDirty: true });
          }
          if (patient.masterId || patient.username) {
            form.setValue('patientUsername', patient.masterId || patient.username, { shouldValidate: true, shouldDirty: true });
          }
          return;
        }
      } catch (err) {
        try {
          const searchRes = await apiClient.get(`/admin/patients?search=${encodeURIComponent(trimmedId)}&limit=1`);
          const first = searchRes.data?.data?.[0];
          if (first && (String(first.masterId).toLowerCase() === trimmedId.toLowerCase() || String(first.username).toLowerCase() === trimmedId.toLowerCase())) {
            setPatientLookup({ loading: false, foundPatient: first });
            if (first.name) form.setValue('patientName', first.name, { shouldValidate: true, shouldDirty: true });
            if (first.age) form.setValue('age', first.age, { shouldValidate: true, shouldDirty: true });
            if (first.address) form.setValue('address', first.address, { shouldValidate: true, shouldDirty: true });
            if (first.doctorName) form.setValue('doctorName', first.doctorName, { shouldValidate: true, shouldDirty: true });
            if (first.masterId || first.username) form.setValue('patientUsername', first.masterId || first.username, { shouldValidate: true, shouldDirty: true });
            return;
          }
        } catch {}
      }
      setPatientLookup({ loading: false, error: 'No patient record found for this Master ID' });
    }, 300);

    return () => clearTimeout(timer);
  }, [isLabReport, watchMasterId, form]);



  const isMedicine = module.key === 'medicines';
  const watchRateType = form.watch('rateType');
  const watchRateIC = form.watch('rateIC');
  const watchRate = form.watch('rate');
  const watchQuantity = form.watch('quantity');
  const watchStock = form.watch('stock');
  const watchMinAlert = form.watch('minStockAlert');

  // Reactively calculate rate in NC when rateType is IC (1 IC = 1.60 NC)
  useEffect(() => {
    if (!isMedicine) return;
    if (watchRateType === 'IC') {
      const ic = parseFloat(watchRateIC);
      if (!isNaN(ic) && ic >= 0) {
        const nc = parseFloat((ic * 1.6).toFixed(2));
        form.setValue('rate', nc, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [isMedicine, watchRateType, watchRateIC, form]);

  // Reactively calculate totalAmount = quantity * rate
  useEffect(() => {
    if (!isMedicine) return;
    const qty = parseFloat(watchQuantity) || 0;
    const rate = parseFloat(watchRate) || 0;
    const total = parseFloat((qty * rate).toFixed(2));
    form.setValue('totalAmount', total, { shouldDirty: true });
  }, [isMedicine, watchQuantity, watchRate, form]);

  // Reactively calculate stockStatus based on stock vs minStockAlert
  useEffect(() => {
    if (!isMedicine) return;
    const stockVal = parseFloat(watchStock);
    const minAlertVal = parseFloat(watchMinAlert) || 10;
    if (isNaN(stockVal) || stockVal <= 0) {
      form.setValue('stockStatus', 'Out of Stock', { shouldDirty: true });
    } else if (stockVal <= minAlertVal) {
      form.setValue('stockStatus', 'Low Stock', { shouldDirty: true });
    } else {
      form.setValue('stockStatus', 'In Stock', { shouldDirty: true });
    }
  }, [isMedicine, watchStock, watchMinAlert, form]);

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(normalizeOutgoing(module.fields, values as Record<string, any>));
      })}
    >
      {isMedicine && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4 text-xs shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-200/60 pb-2.5">
            <div className="flex items-center gap-2 font-bold text-sky-950">
              <Pill className="h-4 w-4 text-sky-600" />
              <span className="uppercase tracking-wider">Medicine Valuation & Stock Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-xs border',
                  form.watch('stockStatus') === 'In Stock'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : form.watch('stockStatus') === 'Low Stock'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-rose-100 text-rose-800 border-rose-300'
                )}
              >
                {form.watch('stockStatus') === 'In Stock' && <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />}
                {form.watch('stockStatus') === 'Low Stock' && <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />}
                {form.watch('stockStatus') === 'Out of Stock' && <Ban className="h-3.5 w-3.5 text-rose-600" />}
                {form.watch('stockStatus') || 'In Stock'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-ink-700">
            <div className="rounded-xl bg-white p-2.5 border border-sky-100 shadow-xs">
              <p className="text-[10px] text-ink-500 font-semibold uppercase tracking-wider">Currency Mode</p>
              <p className="font-bold text-ink-900 mt-0.5">
                {watchRateType === 'IC' ? '🇮🇳 IC (INR × 1.60)' : '🇳🇵 NC (NPR)'}
              </p>
            </div>
            <div className="rounded-xl bg-white p-2.5 border border-sky-100 shadow-xs">
              <p className="text-[10px] text-ink-500 font-semibold uppercase tracking-wider">Selling Price (NC)</p>
              <p className="font-bold text-brand-700 mt-0.5 font-mono text-sm">
                Rs. {Number(watchRate || 0).toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl bg-white p-2.5 border border-sky-100 shadow-xs">
              <p className="text-[10px] text-ink-500 font-semibold uppercase tracking-wider">Batch Total Value</p>
              <p className="font-bold text-emerald-700 mt-0.5 font-mono text-sm">
                Rs. {Number(form.watch('totalAmount') || 0).toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl bg-white p-2.5 border border-sky-100 shadow-xs">
              <p className="text-[10px] text-ink-500 font-semibold uppercase tracking-wider">Stock / Threshold</p>
              <p className="font-bold text-ink-900 mt-0.5 font-mono">
                {watchStock ?? 0} <span className="text-[10px] text-ink-400 font-normal">/ min {watchMinAlert ?? 10}</span>
              </p>
            </div>
          </div>
          {watchRateType === 'IC' && (
            <p className="text-[11px] text-sky-800 bg-sky-100/60 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
              <Calculator className="h-3.5 w-3.5 text-sky-600 shrink-0" />
              <span>
                Indian Currency (IC) peg auto-applied: <strong>{watchRateIC || 0} IC × 1.60 = Rs. {Number(watchRate || 0).toFixed(2)} NC</strong> (Hospital Rate Standard).
              </span>
            </p>
          )}
        </div>
      )}
            {isLabReport && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4 text-xs shadow-sm space-y-2">
          <div className="flex items-center justify-between gap-2 border-b border-sky-200/60 pb-2">
            <div className="flex items-center gap-2 font-bold text-sky-950">
              <FileText className="h-4 w-4 text-sky-600" />
              <span className="uppercase tracking-wider">Patient Master ID Auto-Fill Assistant</span>
            </div>
            {patientLookup.loading && (
              <span className="text-sky-700 font-semibold animate-pulse">Searching Master ID…</span>
            )}
            {patientLookup.foundPatient && (
              <span className="px-2.5 py-0.5 rounded-full font-bold text-xs bg-emerald-100 text-emerald-800 border border-emerald-300">
                ✓ Patient Verified
              </span>
            )}
            {patientLookup.error && !patientLookup.loading && !patientLookup.foundPatient && (
              <span className="px-2.5 py-0.5 rounded-full font-medium text-xs bg-amber-100 text-amber-800 border border-amber-300">
                {patientLookup.error}
              </span>
            )}
          </div>
          {patientLookup.foundPatient ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-ink-700">
              <span><strong>Patient:</strong> {patientLookup.foundPatient.name}</span>
              <span><strong>Age:</strong> {patientLookup.foundPatient.age || '—'}</span>
              <span><strong>Address:</strong> {patientLookup.foundPatient.address || '—'}</span>
              <span><strong>Doctor:</strong> {patientLookup.foundPatient.doctorName || '—'}</span>
            </div>
          ) : (
            <p className="text-ink-500">
              Enter the patient&apos;s <strong>Master ID</strong> below — their Full Name, Age, Address, and Doctor Name will populate automatically.
            </p>
          )}
        </div>
      )}
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
                  if (field.allowCustom || field.name === 'form' || field.name === 'unit' || field.name === 'teamCategory') {
                    return <CreatableSelectField field={field} value={rhf.value} onChange={rhf.onChange} />;
                  }
                  return (
                    <Select {...rhf} value={rhf.value || ''}>
                      <option value="">Select…</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </Select>
                  );
                }
                if (field.type === 'permissions') {
                  return (
                    <PermissionCheckboxesField
                      options={field.options}
                      value={rhf.value}
                      onChange={rhf.onChange}
                    />
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
                if (field.name === 'age') {
                  return <AgeInputField value={rhf.value} onChange={rhf.onChange} placeholder={field.placeholder} />;
                }
                if (field.name === 'doctorName' || field.name === 'doctor') {
                  return <DoctorSelectField value={rhf.value} onChange={rhf.onChange} placeholder={field.placeholder} />;
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
