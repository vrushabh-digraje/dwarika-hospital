import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getHomepage, updateHomepage } from '../api/cmsApi';
import { Button, Card, Input, Label, LoadingBlock, PageHeader, Textarea } from '../components/ui';
import { MediaPicker } from '../components/MediaPicker';
import { RichTextEditor } from '../components/RichTextEditor';
import HeroSection from '../../sections/HeroSection';

export default function HomepagePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [originalData, setOriginalData] = useState<any>(null);
  const form = useForm<any>();

  useEffect(() => {
    getHomepage()
      .then((data) => {
        setOriginalData(data);
        form.reset({
          ...data,
          bannerImages: (data.hero?.bannerImages || []).join('\n'),
          countersJson: JSON.stringify(data.counters || [], null, 2),
        });
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = form.handleSubmit(async (values) => {
    if (
      !values.hero?.badge || !values.hero?.badgeNp ||
      !values.hero?.titlePart1 || !values.hero?.titlePart1Np ||
      !values.hero?.titlePart2 || !values.hero?.titlePart2Np ||
      !values.hero?.description || !values.hero?.descriptionNp ||
      !values.cta?.title || !values.cta?.titleNp ||
      !values.cta?.description || !values.cta?.descriptionNp
    ) {
      toast.error('All dynamic text fields must be filled in BOTH English and Nepali.');
      return;
    }
    setSaving(true);
    try {
      let counters = [];
      try {
        counters = JSON.parse(values.countersJson || '[]');
      } catch {
        throw new Error('Counters JSON is invalid');
      }
      const payload = {
        status: values.status || 'published',
        hero: {
          ...(values.hero || {}),
          bannerImages: String(values.bannerImages || '')
            .split('\n')
            .map((s: string) => s.trim())
            .filter(Boolean),
        },
        counters,
        cta: values.cta || {},
        sections: values.sections || [],
      };
      const saved = await updateHomepage(payload);
      setOriginalData(saved);
      form.reset({
        ...saved,
        bannerImages: (saved.hero?.bannerImages || []).join('\n'),
        countersJson: JSON.stringify(saved.counters || [], null, 2),
      });
      toast.success('Homepage content saved');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  });

  const handleDiscard = () => {
    if (originalData) {
      form.reset({
        ...originalData,
        bannerImages: (originalData.hero?.bannerImages || []).join('\n'),
        countersJson: JSON.stringify(originalData.counters || [], null, 2),
      });
      toast.info('Changes discarded');
    }
  };

  const handleResetToDefaults = () => {
    form.reset({
      hero: {
        badge: "✨ Nepal's Premier Healthcare Destination",
        awardBadgeTitle: 'Award Winning',
        awardBadgeSubtitle: 'Healthcare 2024',
        titlePart1: 'Your Health,',
        titlePart2: 'Our Commitment.',
        description: 'Experience a new standard of medical excellence. Dwarika Hospital combines world-class clinical expertise with an empathetic heart, powered by advanced technology.',
        primaryCtaLabel: 'Book Appointment',
        primaryCtaLink: '/appointment',
        secondaryCtaLabel: 'Explore Services',
        secondaryCtaLink: '/#services',
      },
      bannerImages: [
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=90&w=2400"
      ].join('\n'),
      countersJson: form.getValues('countersJson'),
      cta: form.getValues('cta'),
      status: form.getValues('status'),
    });
    toast.info('Reset fields to original defaults (Click Save to update database)');
  };

  // Watch nested fields individually to guarantee React updates on every keystroke
  const watchedBadge = form.watch('hero.badge');
  const watchedBadgeNp = form.watch('hero.badgeNp');
  const watchedAwardTitle = form.watch('hero.awardBadgeTitle');
  const watchedAwardTitleNp = form.watch('hero.awardBadgeTitleNp');
  const watchedAwardSubtitle = form.watch('hero.awardBadgeSubtitle');
  const watchedAwardSubtitleNp = form.watch('hero.awardBadgeSubtitleNp');
  const watchedTitle1 = form.watch('hero.titlePart1');
  const watchedTitle1Np = form.watch('hero.titlePart1Np');
  const watchedTitle2 = form.watch('hero.titlePart2');
  const watchedTitle2Np = form.watch('hero.titlePart2Np');
  const watchedDesc = form.watch('hero.description');
  const watchedDescNp = form.watch('hero.descriptionNp');
  const watchedPrimaryLabel = form.watch('hero.primaryCtaLabel');
  const watchedPrimaryLabelNp = form.watch('hero.primaryCtaLabelNp');
  const watchedPrimaryLink = form.watch('hero.primaryCtaLink');
  const watchedSecondaryLabel = form.watch('hero.secondaryCtaLabel');
  const watchedSecondaryLabelNp = form.watch('hero.secondaryCtaLabelNp');
  const watchedSecondaryLink = form.watch('hero.secondaryCtaLink');
  const watchedBannerImages = form.watch('bannerImages');
  const watchedCountersJson = form.watch('countersJson');
  const watch = form.watch;

  const previewPayload = useMemo(() => {
    let parsedCounters = [];
    try {
      parsedCounters = JSON.parse(watchedCountersJson || '[]');
    } catch {
      // Keep empty if invalid JSON during typing
    }
    return {
      hero: {
        badge: watchedBadge || '',
        badgeNp: watchedBadgeNp || '',
        awardBadgeTitle: watchedAwardTitle || '',
        awardBadgeTitleNp: watchedAwardTitleNp || '',
        awardBadgeSubtitle: watchedAwardSubtitle || '',
        awardBadgeSubtitleNp: watchedAwardSubtitleNp || '',
        titlePart1: watchedTitle1 || '',
        titlePart1Np: watchedTitle1Np || '',
        titlePart2: watchedTitle2 || '',
        titlePart2Np: watchedTitle2Np || '',
        description: watchedDesc || '',
        descriptionNp: watchedDescNp || '',
        primaryCtaLabel: watchedPrimaryLabel || '',
        primaryCtaLabelNp: watchedPrimaryLabelNp || '',
        primaryCtaLink: watchedPrimaryLink || '',
        secondaryCtaLabel: watchedSecondaryLabel || '',
        secondaryCtaLabelNp: watchedSecondaryLabelNp || '',
        secondaryCtaLink: watchedSecondaryLink || '',
        bannerImages: String(watchedBannerImages || '')
          .split('\n')
          .map((s: string) => s.trim())
          .filter(Boolean),
      },
      counters: parsedCounters,
    };
  }, [
    watchedBadge,
    watchedBadgeNp,
    watchedAwardTitle,
    watchedAwardTitleNp,
    watchedAwardSubtitle,
    watchedAwardSubtitleNp,
    watchedTitle1,
    watchedTitle1Np,
    watchedTitle2,
    watchedTitle2Np,
    watchedDesc,
    watchedDescNp,
    watchedPrimaryLabel,
    watchedPrimaryLabelNp,
    watchedPrimaryLink,
    watchedSecondaryLabel,
    watchedSecondaryLabelNp,
    watchedSecondaryLink,
    watchedBannerImages,
    watchedCountersJson,
  ]);

  // Keep LoadingBlock render below all React Hooks to avoid breaking React Hook Rules
  if (loading) return <LoadingBlock />;

  return (
    <div>
      <PageHeader
        title="Homepage"
        description="Hero, banners, counters, sections, and CTA content."
        breadcrumbs={[{ label: 'CMS' }, { label: 'Homepage' }]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-xs text-ink-300 hover:text-ink-600 hover:bg-transparent opacity-40 hover:opacity-100 transition-opacity"
              onClick={handleResetToDefaults}
            >
              Reset to Defaults
            </Button>
            <Button variant="outline" onClick={() => setIsPreviewOpen(true)}>
              Live Preview
            </Button>
            <Button variant="outline" onClick={handleDiscard}>
              Discard Changes
            </Button>
            <Button loading={saving} onClick={onSubmit}>
              Save Homepage
            </Button>
          </div>
        }
      />

      <form onSubmit={onSubmit} className="grid gap-4 xl:grid-cols-2">
        <Card className="space-y-4 p-5 xl:col-span-2">
          <h3 className="font-display text-lg font-semibold">Hero</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Badge (English)</Label>
              <Input {...form.register('hero.badge')} />
            </div>
            <div>
              <Label>ब्याज / लेबल (नेपाली)</Label>
              <Input {...form.register('hero.badgeNp')} />
            </div>
            <div>
              <Label>Award Badge Title (English)</Label>
              <Input {...form.register('hero.awardBadgeTitle')} />
            </div>
            <div>
              <Label>पुरस्कार ब्याज शीर्षक (नेपाली)</Label>
              <Input {...form.register('hero.awardBadgeTitleNp')} />
            </div>
            <div>
              <Label>Award Badge Subtitle (English)</Label>
              <Input {...form.register('hero.awardBadgeSubtitle')} />
            </div>
            <div>
              <Label>पुरस्कार ब्याज उपशीर्षक (नेपाली)</Label>
              <Input {...form.register('hero.awardBadgeSubtitleNp')} />
            </div>
            <div>
              <Label>Title Part 1 (English)</Label>
              <Input {...form.register('hero.titlePart1')} />
            </div>
            <div>
              <Label>शीर्षक भाग १ (नेपाली)</Label>
              <Input {...form.register('hero.titlePart1Np')} />
            </div>
            <div>
              <Label>Title Part 2 (English)</Label>
              <Input {...form.register('hero.titlePart2')} />
            </div>
            <div>
              <Label>शीर्षक भाग २ (नेपाली)</Label>
              <Input {...form.register('hero.titlePart2Np')} />
            </div>
            <div className="md:col-span-2">
              <Label>Description (English)</Label>
              <Textarea {...form.register('hero.description')} rows={4} />
            </div>
            <div className="md:col-span-2">
              <Label>विवरण (नेपाली)</Label>
              <Textarea {...form.register('hero.descriptionNp')} rows={4} />
            </div>
            <div>
              <Label>Primary CTA Label (English)</Label>
              <Input {...form.register('hero.primaryCtaLabel')} />
            </div>
            <div>
              <Label>मुख्य बटन लेबल (नेपाली)</Label>
              <Input {...form.register('hero.primaryCtaLabelNp')} />
            </div>
            <div className="md:col-span-2">
              <Label>Primary CTA Link</Label>
              <Input {...form.register('hero.primaryCtaLink')} />
            </div>
            <div>
              <Label>Secondary CTA Label (English)</Label>
              <Input {...form.register('hero.secondaryCtaLabel')} />
            </div>
            <div>
              <Label>सहायक बटन लेबल (नेपाली)</Label>
              <Input {...form.register('hero.secondaryCtaLabelNp')} />
            </div>
            <div className="md:col-span-2">
              <Label>Secondary CTA Link</Label>
              <Input {...form.register('hero.secondaryCtaLink')} />
            </div>
            <div className="md:col-span-2">
              <Label>Banner Image URLs (one per line)</Label>
              <Textarea {...form.register('bannerImages')} rows={4} />
            </div>
          </div>
        </Card>

        <Card className="space-y-4 p-5">
          <h3 className="font-display text-lg font-semibold">Counters (JSON)</h3>
          <Textarea {...form.register('countersJson')} rows={14} className="font-mono text-xs" />
        </Card>

        <Card className="space-y-4 p-5">
          <h3 className="font-display text-lg font-semibold">CTA Block</h3>
          <div>
            <Label>Title (English)</Label>
            <Input {...form.register('cta.title')} />
          </div>
          <div>
            <Label>शीर्षक (नेपाली)</Label>
            <Input {...form.register('cta.titleNp')} />
          </div>
          <div>
            <Label>Description (English)</Label>
            <RichTextEditor value={watch('cta.description')} onChange={(v) => form.setValue('cta.description', v)} />
          </div>
          <div>
            <Label>विवरण (नेपाली)</Label>
            <RichTextEditor value={watch('cta.descriptionNp')} onChange={(v) => form.setValue('cta.descriptionNp', v)} />
          </div>
          <div>
            <Label>Button Label (English)</Label>
            <Input {...form.register('cta.buttonLabel')} />
          </div>
          <div>
            <Label>बटन लेबल (नेपाली)</Label>
            <Input {...form.register('cta.buttonLabelNp')} />
          </div>
          <div>
            <Label>Button Link</Label>
            <Input {...form.register('cta.buttonLink')} />
          </div>
          <div>
            <Label>Image</Label>
            <MediaPicker value={watch('cta.imageUrl')} onChange={(v) => form.setValue('cta.imageUrl', v)} />
          </div>
        </Card>
      </form>

      {/* Full-Screen Live Preview Overlay Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[150] bg-slate-950 flex flex-col">
          {/* Top Control Header */}
          <div className="bg-[#0f172a] border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <h3 className="text-white text-xs font-black uppercase tracking-widest">
                🖥️ Live Preview Mode (Draft)
              </h3>
            </div>
            <p className="text-slate-400 text-xs hidden md:block">
              This is a full-screen live preview of your draft Hero section. Changes will apply to the public site only after saving.
            </p>
            <button 
              type="button"
              className="px-4 py-2 text-sm font-semibold text-white border border-white/20 rounded-xl hover:bg-white/10 active:scale-95 transition-all" 
              onClick={() => setIsPreviewOpen(false)}
            >
              Close Preview
            </button>
          </div>

          {/* Full Size Preview Content */}
          <div className="flex-1 overflow-y-auto">
            <HeroSection previewData={previewPayload} />
          </div>
        </div>
      )}
    </div>
  );
}
