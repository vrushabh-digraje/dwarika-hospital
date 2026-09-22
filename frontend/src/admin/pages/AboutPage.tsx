import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import { getAbout, updateAbout } from '../api/cmsApi';
import { Button, Card, Input, Label, LoadingBlock, PageHeader, Select, Textarea } from '../components/ui';
import { MediaPicker } from '../components/MediaPicker';
import { RichTextEditor } from '../components/RichTextEditor';
import { Plus, Trash2, User } from 'lucide-react';

const DEFAULT_LEADERS = [
  {
    name: 'Dr. Rajesh Kumar',
    role: 'Managing Director',
    image: '/leadership/leader2.jpg',
    bio: 'Specializing in health administration with over 20 years of clinical experience. He has been instrumental in growing the hospital from a small clinic to a multi-specialty regional healthcare leader. His vision focuses on patient-centric care and integrating modern technology into medical practices.',
  },
  {
    name: 'Ms. Anjali Sharma',
    role: 'Administrative Head',
    image: '/leadership/leader1.png',
    bio: 'Expert in hospital operations and strategic planning for healthcare growth. With a background in healthcare management from top institutions, Anjali ensures the daily operations run smoothly and efficiently, focusing on quality control and patient satisfaction.',
  },
];

export default function AboutAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const form = useForm<any>({ defaultValues: { status: 'published' } });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'leaders',
  });

  useEffect(() => {
    getAbout()
      .then((data) => {
        const formData = {
          ...data,
          leadershipTitle: data.leadershipTitle || 'Our Leadership',
          leadershipSubtitle:
            data.leadershipSubtitle ||
            'Guided by a team of dedicated professionals committed to delivering world-class healthcare to our community.',
          leaders:
            data.leaders && data.leaders.length > 0 ? data.leaders : DEFAULT_LEADERS,
        };
        form.reset(formData);
      })
      .catch((e) => {
        if (!String(e.message).includes('not found')) toast.error(e.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = form.handleSubmit(async (values) => {
    setSaving(true);
    try {
      const saved = await updateAbout(values);
      form.reset({
        ...saved,
        leadershipTitle: saved.leadershipTitle || 'Our Leadership',
        leadershipSubtitle:
          saved.leadershipSubtitle ||
          'Guided by a team of dedicated professionals committed to delivering world-class healthcare to our community.',
        leaders:
          saved.leaders && saved.leaders.length > 0 ? saved.leaders : DEFAULT_LEADERS,
      });
      toast.success('About and Leadership content saved');
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
        description="Mission, vision, leadership team, story, and institutional content."
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

        {/* Leadership Team Management */}
        <Card className="space-y-6 p-5 xl:col-span-2">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-ink-900">Our Leadership Team</h3>
              <p className="text-xs text-ink-500">Add, edit, or remove leadership profiles displayed on the About Us page.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: '', role: '', image: '', bio: '' })}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Leader
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Section Title</Label>
              <Input {...form.register('leadershipTitle')} />
            </div>
            <div>
              <Label>Section Subtitle / Description</Label>
              <Input {...form.register('leadershipSubtitle')} />
            </div>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-ink-800">
                    <User className="w-4 h-4 text-brand-600" />
                    Leader #{index + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove Leader"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Full Name</Label>
                    <Input {...form.register(`leaders.${index}.name`)} placeholder="e.g. Dr. Rajesh Kumar" />
                  </div>
                  <div>
                    <Label>Role / Designation</Label>
                    <Input {...form.register(`leaders.${index}.role`)} placeholder="e.g. Managing Director" />
                  </div>
                </div>

                <div>
                  <Label>Profile Photo</Label>
                  <MediaPicker
                    value={watch(`leaders.${index}.image`)}
                    onChange={(v) => form.setValue(`leaders.${index}.image`, v)}
                  />
                </div>

                <div>
                  <Label>Biography</Label>
                  <Textarea
                    {...form.register(`leaders.${index}.bio`)}
                    rows={3}
                    placeholder="Enter biography or professional background..."
                  />
                </div>
              </div>
            ))}
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
