import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Radio,
  Plus,
  Trash2,
  RefreshCw,
  MoveUp,
  MoveDown,
  Edit2,
  Check,
  Ban,
  X,
  Megaphone,
  Sliders,
  FileText,
} from 'lucide-react';
import {
  getLiveUpdates,
  updateLiveUpdates,
  addLiveUpdateLine,
  deleteLiveUpdateLine,
} from '../api/cmsApi';
import { Button, Card, Input, Label, LoadingBlock, PageHeader, Select, Textarea } from '../components/ui';
import { cn } from '../lib/format';

export default function LiveUpdatesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [lines, setLines] = useState<string[]>([]);
  const [settings, setSettings] = useState({
    enabled: true,
    badgeTextEn: 'Live Updates',
    badgeTextNp: 'ताजा जानकारी',
    speed: 'normal' as 'slow' | 'normal' | 'fast',
  });

  // State for adding a new line
  const [newLineText, setNewLineText] = useState('');
  const [addingLine, setAddingLine] = useState(false);

  // State for inline editing a line
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  // Bulk edit toggle
  const [isBulkEdit, setIsBulkEdit] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const loadData = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      const res = await getLiveUpdates();
      setLines(res.lines || []);
      setSettings(
        res.settings || {
          enabled: true,
          badgeTextEn: 'Live Updates',
          badgeTextNp: 'ताजा जानकारी',
          speed: 'normal',
        }
      );
      setBulkText((res.lines || []).join('\n'));
      if (showToast) toast.success('Live updates refreshed');
    } catch (e: any) {
      toast.error(e.message || 'Failed to load live updates');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddLine = async () => {
    if (!newLineText.trim()) {
      toast.error('Please enter update text');
      return;
    }
    setAddingLine(true);
    try {
      const updated = await addLiveUpdateLine(newLineText.trim());
      setLines(updated);
      setBulkText(updated.join('\n'));
      setNewLineText('');
      toast.success('Live update line added');
    } catch (e: any) {
      toast.error(e.message || 'Failed to add line');
    } finally {
      setAddingLine(false);
    }
  };

  const handleDeleteLine = async (index: number) => {
    const original = [...lines];
    const next = lines.filter((_, i) => i !== index);
    setLines(next);
    setBulkText(next.join('\n'));

    try {
      await deleteLiveUpdateLine(index);
      toast.success('Update line removed');
    } catch (e: any) {
      setLines(original);
      toast.error(e.message || 'Failed to delete line');
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= lines.length) return;

    const newLines = [...lines];
    const temp = newLines[index];
    newLines[index] = newLines[targetIndex];
    newLines[targetIndex] = temp;

    setLines(newLines);
    setBulkText(newLines.join('\n'));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditingText(lines[index] || '');
  };

  const saveInlineEdit = (index: number) => {
    if (!editingText.trim()) {
      handleDeleteLine(index);
      setEditingIndex(null);
      return;
    }
    const updated = [...lines];
    updated[index] = editingText.trim();
    setLines(updated);
    setBulkText(updated.join('\n'));
    setEditingIndex(null);
  };

  const applyBulkEdit = () => {
    const parsed = bulkText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    setLines(parsed);
    setIsBulkEdit(false);
    toast.info('Applied bulk text changes. Click "Save Live Updates" to persist.');
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const payloadLines = isBulkEdit
        ? bulkText
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        : lines;

      await updateLiveUpdates({
        lines: payloadLines,
        settings,
      });

      setLines(payloadLines);
      setBulkText(payloadLines.join('\n'));
      setIsBulkEdit(false);
      toast.success('Live updates ticker published successfully to website');
    } catch (e: any) {
      toast.error(e.message || 'Failed to save live updates');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingBlock label="Loading live updates…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Updates & Marquee Ticker"
        description="Configure the scrolling live announcement banner that appears across the top of the Dwarika Hospital main website."
        breadcrumbs={[{ label: 'CMS' }, { label: 'Live Updates' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              loading={refreshing}
              onClick={() => loadData(true)}
              className="gap-1.5"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={saving}
              onClick={handleSaveAll}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              <Check className="h-4 w-4" />
              Save Live Updates
            </Button>
          </div>
        }
      />

      {/* Live Website Ticker Simulation Box */}
      <div className="rounded-2xl border border-red-200 bg-white overflow-hidden shadow-md">
        <div className="bg-ink-900 px-4 py-2 flex items-center justify-between text-xs text-ink-300">
          <span className="flex items-center gap-2 font-mono text-emerald-400">
            <Radio className="h-3.5 w-3.5 animate-pulse text-red-500" />
            Live Website Navbar Ticker Preview
          </span>
          <span className="text-[11px] text-ink-400">
            Status: {settings.enabled ? '🟢 Enabled on Website' : '🔴 Hidden on Website'}
          </span>
        </div>

        {/* The Exact Navbar Live Ticker */}
        <div className="bg-[#17372f] text-white relative overflow-hidden border-t border-white/10">
          <div className="flex items-center relative z-10">
            <div className="shrink-0 bg-gradient-to-r from-red-600 to-red-500 text-white px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 shadow-md border-r border-white/10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span>{settings.badgeTextEn || 'LIVE UPDATES'}</span>
            </div>

            <div className="flex-1 overflow-hidden whitespace-nowrap">
              <div className="animate-marquee py-2.5 flex items-center">
                {(lines.length > 0 ? [...lines, ...lines] : ['No live update lines added yet.']).map(
                  (item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-8 text-xs font-bold tracking-wide uppercase text-white/95"
                    >
                      <span className="w-3 h-[1px] bg-white/40 mr-3" />
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Card: Badge Text & Visibility Toggle */}
      <Card className="p-5 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-ink-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-emerald-700" />
            <h3 className="font-display text-sm font-bold text-ink-900">Ticker Display Settings</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-600 font-medium">Show Ticker on Website:</span>
            <button
              type="button"
              onClick={() => setSettings((s) => ({ ...s, enabled: !s.enabled }))}
              className={cn(
                'relative inline-flex h-8 w-28 items-center rounded-xl px-2 font-bold text-xs transition shadow-sm select-none cursor-pointer',
                settings.enabled
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white justify-end pr-7'
                  : 'bg-red-600 hover:bg-red-700 text-white justify-start pl-7'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 bottom-0.5 w-6 rounded-lg bg-white flex items-center justify-center text-xs shadow transition-all duration-200',
                  settings.enabled ? 'right-0.5 text-emerald-700' : 'left-0.5 text-red-700'
                )}
              >
                {settings.enabled ? <Check className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
              </span>
              <span>{settings.enabled ? 'ACTIVE' : 'OFF'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Badge Text</Label>
            <Input
              value={settings.badgeTextEn}
              onChange={(e) => setSettings((s) => ({ ...s, badgeTextEn: e.target.value }))}
              placeholder="e.g. LIVE UPDATES"
              className="text-xs h-9 bg-white"
            />
          </div>
          <div>
            <Label className="text-xs">Scroll Speed</Label>
            <Select
              value={settings.speed}
              onChange={(e) => setSettings((s) => ({ ...s, speed: e.target.value as any }))}
              className="text-xs h-9 bg-white"
            >
              <option value="slow">Slow</option>
              <option value="normal">Normal (Recommended)</option>
              <option value="fast">Fast</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Main Ticker Lines Management */}
      <Card className="p-5 bg-white shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink-100 pb-3">
          <div>
            <h3 className="font-display text-sm font-bold text-ink-900 flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-emerald-700" />
              Ticker Update Lines ({lines.length} Active Lines)
            </h3>
            <p className="text-xs text-ink-500 mt-0.5">
              These messages cycle continuously in the website top red banner.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (!isBulkEdit) setBulkText(lines.join('\n'));
                setIsBulkEdit(!isBulkEdit);
              }}
              className="text-xs gap-1 h-8"
            >
              <FileText className="h-3.5 w-3.5" />
              {isBulkEdit ? 'Switch to Card View' : 'Bulk Multi-Line Editor'}
            </Button>
          </div>
        </div>

        {/* Quick Add Bar */}
        {!isBulkEdit && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-ink-50/70 border border-ink-200">
            <Input
              value={newLineText}
              onChange={(e) => setNewLineText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddLine();
                }
              }}
              placeholder="Type a new live update line (e.g. Free Health Camp this Sunday at 10 AM)…"
              className="text-xs h-9 bg-white flex-1"
            />
            <Button
              type="button"
              size="sm"
              loading={addingLine}
              onClick={handleAddLine}
              className="h-9 px-4 bg-[#17372f] hover:bg-[#1f5144] text-white text-xs font-bold shrink-0 gap-1"
            >
              <Plus className="h-4 w-4" /> Add Line
            </Button>
          </div>
        )}

        {/* Bulk Multi-line View */}
        {isBulkEdit ? (
          <div className="space-y-3 pt-2">
            <Label className="text-xs font-semibold text-ink-700">
              Edit all ticker lines directly (one message per line):
            </Label>
            <Textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={8}
              className="font-mono text-xs leading-relaxed bg-white"
              placeholder="One update line per row..."
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsBulkEdit(false)}>
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={applyBulkEdit} className="bg-[#17372f] text-white">
                Apply Lines
              </Button>
            </div>
          </div>
        ) : (
          /* Card-by-Card View */
          <div className="space-y-2.5 pt-1">
            {lines.length === 0 ? (
              <div className="p-8 text-center text-ink-400 bg-ink-50/50 rounded-2xl border border-dashed border-ink-200">
                <Radio className="h-8 w-8 mx-auto text-ink-300 mb-1" />
                <p className="text-xs font-semibold text-ink-600">No ticker update lines currently active</p>
                <p className="text-[11px] text-ink-400 mt-0.5">Use the input above to add your first line.</p>
              </div>
            ) : (
              lines.map((line, idx) => {
                const isEditing = editingIndex === idx;

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-ink-200/80 bg-white hover:border-ink-300 transition flex items-center justify-between gap-3 shadow-2xs group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-ink-100 text-ink-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>

                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveInlineEdit(idx);
                            }}
                            className="text-xs h-8 bg-white flex-1"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => saveInlineEdit(idx)}
                            className="p-1 rounded-md bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            title="Save"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingIndex(null)}
                            className="p-1 rounded-md bg-ink-100 text-ink-600 hover:bg-ink-200"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs font-medium text-ink-900 truncate">{line}</p>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => handleMove(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-ink-400 hover:text-ink-700 disabled:opacity-30 rounded hover:bg-ink-100"
                          title="Move Up"
                        >
                          <MoveUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMove(idx, 'down')}
                          disabled={idx === lines.length - 1}
                          className="p-1 text-ink-400 hover:text-ink-700 disabled:opacity-30 rounded hover:bg-ink-100"
                          title="Move Down"
                        >
                          <MoveDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(idx)}
                          className="p-1 text-ink-400 hover:text-ink-700 rounded hover:bg-ink-100"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLine(idx)}
                          className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
