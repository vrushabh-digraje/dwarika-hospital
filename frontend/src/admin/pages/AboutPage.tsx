import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getAbout, updateAbout } from '../api/cmsApi';
import { Button, Card, Input, Label, LoadingBlock, PageHeader, Select, Textarea } from '../components/ui';
import { MediaPicker } from '../components/MediaPicker';
import { RichTextEditor } from '../components/RichTextEditor';

export default function AboutAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const form = useForm<any>({ defaultValues: { status: 'published' } });

  useEffect(() => {
    getAbout()
      .then((data) => form.reset(data))
      .catch((e) => {
        if (!String(e.message).includes('not found')) toast.error(e.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = form.handleSubmit(async (values) => {
    setSaving(true);
    try {
      const saved = await updateAbout(values);
      form.reset(saved);
      toast.success('About content saved');
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
        title="About Hospital"
        description="Mission, vision, story, and institutional content."
        breadcrumbs={[{ label: 'CMS' }, { label: 'About Hospital' }]}
        actions={<Button loading={saving} onClick={onSubmit}>Save About</Button>}
      />

      <form onSubmit={onSubmit} className="grid gap-4 xl:grid-cols-2">
        <Card className="space-y-4 p-5">
          <div>
            <Label>Title</Label>
            <Input {...form.register('title')} />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input {...form.register('tagline')} />
          </div>
          <div>
            <Label>Introduction</Label>
            <Textarea {...form.register('introduction')} rows={4} />
          </div>
          <div>
            <Label>Status</Label>
            <Select {...form.register('status')}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </Select>
          </div>
          <div>
            <Label>Story Image</Label>
            <MediaPicker value={watch('storyImageUrl')} onChange={(v) => form.setValue('storyImageUrl', v)} />
          </div>
        </Card>

        <Card className="space-y-4 p-5">
          <div>
            <Label>Mission Title</Label>
            <Input {...form.register('missionTitle')} />
          </div>
          <div>
            <Label>Mission Text</Label>
            <Textarea {...form.register('missionText')} rows={3} />
          </div>
          <div>
            <Label>Vision Title</Label>
            <Input {...form.register('visionTitle')} />
          </div>
          <div>
            <Label>Vision Text</Label>
            <Textarea {...form.register('visionText')} rows={3} />
          </div>
        </Card>

        <Card className="space-y-4 p-5 xl:col-span-2">
          <Label>Hospital Story</Label>
          <RichTextEditor value={watch('storyHtml')} onChange={(v) => form.setValue('storyHtml', v)} />
        </Card>
      </form>
    </div>
  );
}
