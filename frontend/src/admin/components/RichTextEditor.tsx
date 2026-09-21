import { Textarea } from './ui';

/** Lightweight rich-text field (HTML). Can be swapped for TipTap later without API changes. */
export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 rounded-t-xl border border-b-0 border-ink-200 bg-ink-50 px-2 py-1.5 text-[11px] font-medium text-ink-500">
        <span className="rounded-md px-2 py-1">HTML / Rich content</span>
        <span className="rounded-md px-2 py-1 text-ink-400">Supports headings, lists, links, bold</span>
      </div>
      <Textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        placeholder={placeholder || '<p>Write content…</p>'}
        className="rounded-t-none font-mono text-[13px] leading-6"
      />
      {value ? (
        <div className="rounded-xl border border-ink-100 bg-ink-50/70 p-3">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-ink-400">Preview</div>
          <div className="prose prose-sm max-w-none text-ink-700" dangerouslySetInnerHTML={{ __html: value }} />
        </div>
      ) : null}
    </div>
  );
}
