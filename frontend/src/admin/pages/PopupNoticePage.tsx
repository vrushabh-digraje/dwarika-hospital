import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Bell,
  Check,
  Ban,
  RefreshCw,
  ExternalLink,
  Eye,
  Image as ImageIcon,
  FileText,
  Sliders,
  X,
  Sparkles,
} from 'lucide-react';
import { getPopupNotice, updatePopupNotice, type PopupNoticeConfig } from '../api/cmsApi';
import { Button, Card, Input, Label, LoadingBlock, PageHeader, Select, Textarea } from '../components/ui';
import { MediaPicker } from '../components/MediaPicker';
import { cn } from '../lib/format';
import { resolveImageUrl } from '../../lib/utils';

export default function PopupNoticePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);

  const [form, setForm] = useState<PopupNoticeConfig>({
    enabled: false,
    title: '',
    titleNp: '',
    message: '',
    messageNp: '',
    imageUrl: '',
    buttonText: '',
    buttonLink: '',
    displayType: 'image_and_text',
    frequency: 'once_per_session',
    showCloseButton: true,
  });

  const loadData = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      const data = await getPopupNotice();
      if (data) {
        setForm({
          enabled: data.enabled ?? false,
          title: data.title || '',
          titleNp: data.titleNp || '',
          message: data.message || '',
          messageNp: data.messageNp || '',
          imageUrl: data.imageUrl || '',
          buttonText: data.buttonText || '',
          buttonLink: data.buttonLink || '',
          displayType: data.displayType || 'image_and_text',
          frequency: data.frequency || 'once_per_session',
          showCloseButton: data.showCloseButton ?? true,
        });
      }
      if (showToast) toast.success('Popup settings refreshed');
    } catch (e: any) {
      toast.error(e.message || 'Failed to load popup settings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = () => {
    setForm((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const updated = await updatePopupNotice(form);
      setForm(updated);
      toast.success(
        updated.enabled
          ? '🎉 Popup banner is now ACTIVE and will open for visitors on the website.'
          : 'Popup banner is now DISABLED on the website.'
      );
    } catch (e: any) {
      toast.error(e.message || 'Failed to save popup settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingBlock label="Loading popup settings…" />;

  const isImageOnly = form.displayType === 'image_only';
  const isTextOnly = form.displayType === 'text_only';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Website Popup Banner & Notice Modal"
        description="Configure an entrance popup notice, advertisement flyer, festival greeting, or emergency announcement that opens when visitors arrive on the Dwarika Hospital website."
        breadcrumbs={[{ label: 'CMS' }, { label: 'Popup Notice' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSimulatedModal(true)}
              className="gap-1.5 bg-white text-ink-700"
            >
              <Eye className="h-4 w-4 text-blue-600" />
              Preview Live Popup
            </Button>
            <Button
              type="button"
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
              type="button"
              variant="primary"
              size="sm"
              loading={saving}
              onClick={() => handleSave()}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Check className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        }
      />

      {/* Master Toggle Banner */}
      <Card
        className={cn(
          'p-5 transition-all duration-200 border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4',
          form.enabled
            ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300/60'
            : 'bg-ink-50/70 border-ink-200'
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm',
              form.enabled ? 'bg-emerald-600 text-white' : 'bg-ink-200 text-ink-600'
            )}
          >
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-600">Website Popup Status:</span>
              <span
                className={cn(
                  'px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide',
                  form.enabled ? 'bg-emerald-200 text-emerald-900' : 'bg-ink-200 text-ink-700'
                )}
              >
                {form.enabled ? '🟢 Active on Website' : '⚪ Disabled (Hidden)'}
              </span>
            </div>
            <p className="text-xs text-ink-600 mt-1">
              {form.enabled
                ? 'The popup notice is currently enabled and will display to website visitors according to the frequency rule.'
                : 'The popup is currently turned off. Visitors will not see any popup.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            'relative inline-flex h-9 w-32 items-center rounded-xl px-2.5 font-bold text-xs transition shadow-sm select-none shrink-0 cursor-pointer',
            form.enabled
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white justify-end pr-8'
              : 'bg-red-600 hover:bg-red-700 text-white justify-start pl-8'
          )}
        >
          <span
            className={cn(
              'absolute top-1 bottom-1 w-7 rounded-lg bg-white flex items-center justify-center text-xs shadow transition-all duration-200',
              form.enabled ? 'right-1 text-emerald-700' : 'left-1 text-red-700'
            )}
          >
            {form.enabled ? <Check className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
          </span>
          <span>{form.enabled ? 'ACTIVE' : 'OFF'}</span>
        </button>
      </Card>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Configuration Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section 1: Display Mode & Frequency */}
          <Card className="p-5 bg-white shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-ink-100 pb-3">
              <Sliders className="h-4 w-4 text-emerald-700" />
              <h3 className="font-display text-sm font-bold text-ink-900">Format & Frequency Rules</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Popup Type</Label>
                <Select
                  value={form.displayType}
                  onChange={(e) => setForm({ ...form, displayType: e.target.value as any })}
                  className="text-xs h-9 bg-white"
                >
                  <option value="image_and_text">Image + Notice Text (Recommended)</option>
                  <option value="image_only">Image / Poster Only</option>
                  <option value="text_only">Notice Text Only (No Image)</option>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Display Frequency</Label>
                <Select
                  value={form.frequency}
                  onChange={(e) => setForm({ ...form, frequency: e.target.value as any })}
                  className="text-xs h-9 bg-white"
                >
                  <option value="once_per_session">Once Per Session (Recommended)</option>
                  <option value="once_per_day">Once Every 24 Hours</option>
                  <option value="always">Always (Every Page Reload)</option>
                </Select>
              </div>
            </div>
          </Card>

          {/* Section 2: Image Selection */}
          {!isTextOnly && (
            <Card className="p-5 bg-white shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-ink-100 pb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-emerald-700" />
                  <h3 className="font-display text-sm font-bold text-ink-900">Popup Image / Flyer / Poster</h3>
                </div>
                {form.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: '' })}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove Image
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Upload or Select Image from Media Library</Label>
                <MediaPicker
                  value={form.imageUrl}
                  onChange={(v) => setForm({ ...form, imageUrl: v })}
                />
                <p className="text-[11px] text-ink-500">
                  Recommended size: 1000 × 750px (4:3) or 1200 × 630px for banner images. Supports JPG, PNG, WEBP.
                </p>
              </div>
            </Card>
          )}

          {/* Section 3: Text Content */}
          {!isImageOnly && (
            <Card className="p-5 bg-white shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-ink-100 pb-2">
                <FileText className="h-4 w-4 text-emerald-700" />
                <h3 className="font-display text-sm font-bold text-ink-900">Notice Text Content</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Popup Title (English)</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Free Eye & Health Camp This Saturday"
                    className="text-xs h-9 bg-white"
                  />
                </div>

                <div>
                  <Label className="text-xs">Popup Title (Nepali)</Label>
                  <Input
                    value={form.titleNp}
                    onChange={(e) => setForm({ ...form, titleNp: e.target.value })}
                    placeholder="e.g. निःशुल्क स्वास्थ्य तथा आँखा शिविर"
                    className="text-xs h-9 bg-white"
                  />
                </div>

                <div>
                  <Label className="text-xs">Message / Description (English)</Label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    placeholder="Detailed notice information, timings, doctors available, contact details..."
                    className="text-xs bg-white"
                  />
                </div>

                <div>
                  <Label className="text-xs">Message / Description (Nepali)</Label>
                  <Textarea
                    value={form.messageNp}
                    onChange={(e) => setForm({ ...form, messageNp: e.target.value })}
                    rows={3}
                    placeholder="विस्तृत सूचना..."
                    className="text-xs bg-white"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Section 4: Action Button */}
          <Card className="p-5 bg-white shadow-sm space-y-3">
            <h3 className="font-display text-sm font-bold text-ink-900 border-b border-ink-100 pb-2">
              Action Button (Optional CTA)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Button Label</Label>
                <Input
                  value={form.buttonText}
                  onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                  placeholder="e.g. Book Appointment, View Notice, Apply Now"
                  className="text-xs h-9 bg-white"
                />
              </div>

              <div>
                <Label className="text-xs">Button Link URL</Label>
                <Input
                  value={form.buttonLink}
                  onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                  placeholder="e.g. /appointment, /online-form, /notices"
                  className="text-xs h-9 bg-white"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Live Visual Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-600 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Live Website Popup Preview
              </span>
              <button
                type="button"
                onClick={() => setShowSimulatedModal(true)}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                Full Modal View <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            {/* Mockup Container */}
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-700 shadow-xl text-center relative overflow-hidden backdrop-blur-md">
              <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 text-left">
                {/* Header Mockup */}
                <div className="p-3 bg-gradient-to-r from-red-600 to-red-500 text-white flex items-center justify-between text-xs font-bold">
                  <span>Hospital Announcement / सूचना</span>
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                    ✕
                  </span>
                </div>

                {/* Image Section */}
                {!isTextOnly && form.imageUrl && (
                  <div className="w-full h-48 bg-slate-100 overflow-hidden relative">
                    <img
                      src={resolveImageUrl(form.imageUrl)}
                      alt="Notice Banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Text Content */}
                {!isImageOnly && (
                  <div className="p-5 space-y-2">
                    <h4 className="font-display text-base font-extrabold text-ink-900">
                      {form.title || 'Notice Headline'}
                    </h4>
                    {form.titleNp && (
                      <p className="text-xs font-semibold text-emerald-800">{form.titleNp}</p>
                    )}
                    <p className="text-xs text-ink-600 leading-relaxed line-clamp-4">
                      {form.message ||
                        'Notice message text will appear here. You can describe the announcement, date, time, and instructions for patients.'}
                    </p>

                    {/* Button */}
                    {form.buttonText && (
                      <div className="pt-2">
                        <span className="inline-block px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm">
                          {form.buttonText}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {isImageOnly && !form.imageUrl && (
                  <div className="p-12 text-center text-ink-400">
                    <ImageIcon className="h-10 w-10 mx-auto text-ink-300 mb-2" />
                    <p className="text-xs font-semibold">Please select an image above</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Fullscreen Interactive Modal Preview */}
      {showSimulatedModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowSimulatedModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowSimulatedModal(false)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition shadow-md"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Poster Image */}
            {!isTextOnly && form.imageUrl && (
              <div className="w-full max-h-72 overflow-hidden bg-slate-100">
                <img
                  src={resolveImageUrl(form.imageUrl)}
                  alt="Notice Flyer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content Body */}
            {!isImageOnly && (
              <div className="p-6 space-y-3">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase tracking-wider">
                    Official Notice / सार्वजनिक सूचना
                  </span>
                  <h3 className="font-display text-xl font-bold text-ink-900 leading-snug">
                    {form.title || 'Notice Headline'}
                  </h3>
                  {form.titleNp && (
                    <p className="text-xs font-bold text-emerald-800">{form.titleNp}</p>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-ink-600 leading-relaxed max-h-48 overflow-y-auto">
                  {form.message || 'Notice message body text...'}
                </p>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSimulatedModal(false)}
                  >
                    Close
                  </Button>
                  {form.buttonText && (
                    <Button
                      type="button"
                      size="sm"
                      className="bg-primary hover:bg-primary-hover text-white"
                      onClick={() => setShowSimulatedModal(false)}
                    >
                      {form.buttonText}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
