import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getSettings, updateSettings } from '../api/cmsApi';
import { Button, Card, Input, Label, LoadingBlock, PageHeader, Textarea } from '../components/ui';
import { MediaPicker } from '../components/MediaPicker';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const form = useForm<any>();

  useEffect(() => {
    getSettings()
      .then((data) => {
        form.reset({
          ...data,
          marqueeLines: (data.marqueeLines || []).join('\n'),
        });
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = form.handleSubmit(async (values) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        marqueeLines: String(values.marqueeLines || '')
          .split('\n')
          .map((s: string) => s.trim())
          .filter(Boolean),
        emails: {
          general: values.emails?.general || values.emailGeneral || '',
          appointment: values.emails?.appointment || values.emailAppointment || '',
          info: values.emails?.info || values.emailInfo || '',
        },
        social: {
          facebook: values.social?.facebook || '',
          instagram: values.social?.instagram || '',
          whatsapp: values.social?.whatsapp || '',
          linkedin: values.social?.linkedin || '',
          youtube: values.social?.youtube || '',
        },
      };
      const saved = await updateSettings(payload);
      form.reset({
        ...saved,
        marqueeLines: (saved.marqueeLines || []).join('\n'),
      });
      toast.success('Website settings saved');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  });

  if (loading) return <LoadingBlock />;

  const watch = form.watch;

  return (
    <div>
      <PageHeader
        title="Website Settings"
        description="Logo, contact details, social links, footer, and hospital information."
        breadcrumbs={[{ label: 'CMS' }, { label: 'Website Settings' }]}
        actions={<Button loading={saving} onClick={onSubmit}>Save Settings</Button>}
      />

      <form onSubmit={onSubmit} className="grid gap-4 xl:grid-cols-2">
        <Card className="space-y-4 p-5">
          <h3 className="font-display text-lg font-semibold">Brand</h3>
          <div>
            <Label>Logo</Label>
            <MediaPicker value={watch('logoUrl')} onChange={(v) => form.setValue('logoUrl', v)} />
          </div>
          <div>
            <Label>Favicon</Label>
            <MediaPicker value={watch('faviconUrl')} onChange={(v) => form.setValue('faviconUrl', v)} />
          </div>
          <div>
            <Label>Brand Name (EN)</Label>
            <Input {...form.register('brandNameEn')} />
          </div>
          <div>
            <Label>Brand Subtitle</Label>
            <Input {...form.register('brandSubtitle')} />
          </div>
          <div>
            <Label>Brand Lockup EN</Label>
            <Input {...form.register('brandLockupEn')} />
          </div>
          <div>
            <Label>Brand Lockup NP</Label>
            <Input {...form.register('brandLockupNp')} />
          </div>
        </Card>

        <Card className="space-y-4 p-5">
          <h3 className="font-display text-lg font-semibold">Contact</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Emergency</Label>
              <Input {...form.register('emergencyNumber')} />
            </div>
            <div>
              <Label>Landline</Label>
              <Input {...form.register('landline')} />
            </div>
            <div>
              <Label>Mobile</Label>
              <Input {...form.register('mobile')} />
            </div>
            <div>
              <Label>WhatsApp</Label>
              <Input {...form.register('whatsapp')} />
            </div>
          </div>
          <div>
            <Label>General Email</Label>
            <Input {...form.register('emails.general')} />
          </div>
          <div>
            <Label>Appointment Email</Label>
            <Input {...form.register('emails.appointment')} />
          </div>
          <div>
            <Label>Info Email</Label>
            <Input {...form.register('emails.info')} />
          </div>
          <div>
            <Label>Address (EN)</Label>
            <Textarea {...form.register('addressEn')} rows={3} />
          </div>
          <div>
            <Label>Website URL</Label>
            <Input {...form.register('websiteUrl')} />
          </div>
        </Card>

        <Card className="space-y-4 p-5">
          <h3 className="font-display text-lg font-semibold">Social Links</h3>
          {['facebook', 'instagram', 'whatsapp', 'linkedin', 'youtube'].map((key) => (
            <div key={key}>
              <Label>{key}</Label>
              <Input {...form.register(`social.${key}`)} />
            </div>
          ))}
        </Card>

        <Card className="space-y-4 p-5">
          <h3 className="font-display text-lg font-semibold">Footer & Marquee</h3>
          <div>
            <Label>Footer Text</Label>
            <Textarea {...form.register('footerText')} rows={3} />
          </div>
          <div>
            <Label>Copyright</Label>
            <Input {...form.register('copyrightText')} />
          </div>
          <div>
            <Label>Marquee Lines (one per line)</Label>
            <Textarea {...form.register('marqueeLines')} rows={6} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label>OPD Days</Label>
              <Input {...form.register('opdHours.days')} />
            </div>
            <div>
              <Label>Open</Label>
              <Input {...form.register('opdHours.open')} />
            </div>
            <div>
              <Label>Close</Label>
              <Input {...form.register('opdHours.close')} />
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
