import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, useEffect, forwardRef } from 'react';
import { Loader2, X } from 'lucide-react';
import { cn, formatDate } from '../lib/format';

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}) {
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
    secondary: 'bg-ink-900 text-white hover:bg-ink-800',
    ghost: 'bg-transparent text-ink-700 hover:bg-ink-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-ink-200 bg-white text-ink-800 hover:bg-ink-50',
  };
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-sm',
  };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'h-10 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';

export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <label className={cn('mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500', className)}>{children}</label>;
}

export function Card({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={cn('rounded-2xl border border-ink-100 bg-white/90 shadow-[0_8px_30px_rgba(31,36,48,0.04)]', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'brand';
}) {
  const tones = {
    neutral: 'bg-ink-100 text-ink-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    brand: 'bg-brand-50 text-brand-700',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', tones[tone])}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status?: string }) {
  const value = (status || 'draft').toLowerCase();
  const tone =
    value === 'published' || value === 'confirmed' || value === 'resolved' || value === 'completed'
      ? 'success'
      : value === 'draft' || value === 'pending' || value === 'new'
        ? 'warning'
        : value === 'cancelled' || value === 'archived'
          ? 'danger'
          : 'brand';
  return <Badge tone={tone as any}>{status || 'draft'}</Badge>;
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {breadcrumbs && (
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-ink-500">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="inline-flex items-center gap-2">
                {i > 0 && <span>/</span>}
                <span className={i === breadcrumbs.length - 1 ? 'font-semibold text-ink-800' : ''}>
                  {crumb.label}
                </span>
              </span>
            ))}
          </div>
        )}
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-ink-50/60 px-6 py-16 text-center">
      <div className="mb-3 h-12 w-12 rounded-2xl bg-white shadow-sm ring-1 ring-ink-100" />
      <h3 className="text-base font-semibold text-ink-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-ink-500">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingBlock({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-ink-100 bg-white">
      <div className="flex items-center gap-3 text-sm text-ink-500">
        <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
        {label}
      </div>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink-900/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-6">
      <div className={cn('max-h-[92vh] w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl', wide ? 'max-w-4xl' : 'max-w-2xl')}>
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
          <button onClick={onClose} className="rounded-xl p-2 text-ink-500 hover:bg-ink-50">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[calc(92vh-64px)] overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  loading,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-ink-600">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-3 border-t border-ink-100 px-4 py-3 text-sm">
      <span className="text-ink-500">Page {page} of {totalPages}</span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</Button>
      </div>
    </div>
  );
}

export function LastUpdated({ value }: { value?: string }) {
  return <span className="text-xs text-ink-400">{formatDate(value)}</span>;
}
