import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  ExternalLink,
  Users,
  Award,
  Clock,
  Mail,
  Phone,
} from 'lucide-react';
import {
  getAcademicData,
  updateAcademicSettings,
  createAcademicProgram,
  updateAcademicProgram,
  deleteAcademicProgram,
  getAcademicInquiries,
  type AcademicProgramItem,
} from '../api/cmsApi';
import { Button, Card, Input, Label, LoadingBlock, Modal, PageHeader, Select, Textarea } from '../components/ui';
import { PageStatusBanner } from '../components/PageStatusBanner';
import { cn } from '../lib/format';

export default function AcademicAdminPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const [activeTab, setActiveTab] = useState<'programs' | 'settings' | 'inquiries'>('programs');

  const [programs, setPrograms] = useState<AcademicProgramItem[]>([]);
  const [settings, setSettings] = useState({
    heroTitle: 'Center for Healthcare Education & Medical Academy',
    heroSubtitle:
      'Producing compassionate, highly skilled medical and paramedical professionals serving regional and national healthcare needs.',
    yearsOfExcellence: '25+',
    graduatesProduced: '8,000+',
    academicProgramsCount: '12',
    researchPapers: '500+',
    brochureUrl: '',
  });
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiriesCount, setInquiriesCount] = useState(0);

  // Modal State for Program Create/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<AcademicProgramItem | null>(null);
  const [programForm, setProgramForm] = useState<Partial<AcademicProgramItem>>({
    title: '',
    titleNp: '',
    duration: '3 Years',
    seats: '40 Seats',
    tag: 'Medical',
    desc: '',
    descNp: '',
    eligibility: '',
    status: 'admissions_open',
    gradient: 'from-blue-900 via-blue-800 to-blue-700',
    sortOrder: 0,
    iconName: 'GraduationCap',
  });
  const [savingProgram, setSavingProgram] = useState(false);

  const loadData = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      const res = await getAcademicData();
      setPrograms(res.programs || []);
      setSettings(res.settings || settings);
      setInquiriesCount(res.inquiriesCount || 0);

      // Also fetch inquiries
      try {
        const inq = await getAcademicInquiries();
        setInquiries(inq || []);
      } catch {}

      if (showToast) toast.success('Academic data refreshed');
    } catch (e: any) {
      toast.error(e.message || 'Failed to load academic data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProgram(null);
    setProgramForm({
      title: '',
      titleNp: '',
      duration: '3 Years',
      seats: '40 Seats',
      tag: 'Medical',
      desc: '',
      descNp: '',
      eligibility: '',
      status: 'admissions_open',
      gradient: 'from-blue-900 via-blue-800 to-blue-700',
      sortOrder: programs.length + 1,
      iconName: 'GraduationCap',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prog: AcademicProgramItem) => {
    setEditingProgram(prog);
    setProgramForm({ ...prog });
    setIsModalOpen(true);
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programForm.title?.trim()) {
      toast.error('Program title is required');
      return;
    }

    setSavingProgram(true);
    try {
      if (editingProgram?._id) {
        const updated = await updateAcademicProgram(editingProgram._id, programForm);
        setPrograms((prev) => prev.map((p) => (p._id === editingProgram._id ? updated : p)));
        toast.success(`Academic program "${updated.title}" updated`);
      } else {
        const created = await createAcademicProgram(programForm);
        setPrograms((prev) => [...prev, created]);
        toast.success(`Academic program "${created.title}" created`);
      }
      setIsModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Failed to save academic program');
    } finally {
      setSavingProgram(false);
    }
  };

  const handleDeleteProgram = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this academic program?')) return;

    try {
      await deleteAcademicProgram(id);
      setPrograms((prev) => prev.filter((p) => p._id !== id));
      toast.success('Academic program deleted');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete program');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateAcademicSettings(settings);
      toast.success('Academic page overview & statistics updated');
    } catch (e: any) {
      toast.error(e.message || 'Failed to update academic settings');
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) return <LoadingBlock label="Loading academic academy data…" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic & Medical Academy"
        description="Manage the Dwarika Hospital & Medical Academy educational programs, admission courses, statistics, and student inquiries."
        breadcrumbs={[{ label: 'CMS' }, { label: 'Academic' }]}
        actions={
          <div className="flex items-center gap-2">
            <a
              href="/academic"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-ink-200 bg-white text-xs font-semibold text-ink-700 hover:bg-ink-50 shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
              Live Academic Page
            </a>
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
              onClick={openCreateModal}
              className="gap-1.5 bg-[#17372f] hover:bg-[#1f5144] text-white"
            >
              <Plus className="h-4 w-4" />
              Add Program
            </Button>
          </div>
        }
      />

      {/* Website Page Control Banner (Active / Block) */}
      <PageStatusBanner pageKey="academic" />

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-ink-200 bg-white px-4 pt-2 rounded-2xl shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('programs')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-bold transition cursor-pointer',
            activeTab === 'programs'
              ? 'border-emerald-600 text-emerald-800 font-extrabold'
              : 'border-transparent text-ink-500 hover:text-ink-900'
          )}
        >
          <BookOpen className="h-4 w-4" />
          Academic Programs ({programs.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-bold transition cursor-pointer',
            activeTab === 'settings'
              ? 'border-emerald-600 text-emerald-800 font-extrabold'
              : 'border-transparent text-ink-500 hover:text-ink-900'
          )}
        >
          <Award className="h-4 w-4" />
          Page Stats & Header
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-bold transition cursor-pointer',
            activeTab === 'inquiries'
              ? 'border-emerald-600 text-emerald-800 font-extrabold'
              : 'border-transparent text-ink-500 hover:text-ink-900'
          )}
        >
          <Users className="h-4 w-4" />
          Student Inquiries ({inquiriesCount || inquiries.length})
        </button>
      </div>

      {/* TAB 1: Academic Programs */}
      {activeTab === 'programs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {programs.map((prog) => {
              const isAdmissionsOpen = prog.status === 'admissions_open';
              const isClosed = prog.status === 'closed';

              return (
                <Card
                  key={prog._id || prog.title}
                  className="p-5 bg-white border border-ink-200/90 shadow-sm hover:shadow transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-bold uppercase tracking-wider">
                          {prog.tag || 'Medical'}
                        </span>
                        <h4 className="font-display text-base font-bold text-ink-900 leading-snug">
                          {prog.title}
                        </h4>
                        {prog.titleNp && (
                          <p className="text-xs text-ink-500 font-medium">{prog.titleNp}</p>
                        )}
                      </div>

                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase shrink-0',
                          isAdmissionsOpen
                            ? 'bg-emerald-100 text-emerald-800'
                            : isClosed
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        )}
                      >
                        {isAdmissionsOpen ? 'Admissions Open' : isClosed ? 'Closed' : 'Active'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 rounded-xl bg-ink-50/70 border border-ink-100">
                      <div>
                        <span className="text-ink-400 block text-[10px] uppercase font-semibold">Duration</span>
                        <span className="font-bold text-ink-800">{prog.duration || '3 Years'}</span>
                      </div>
                      <div>
                        <span className="text-ink-400 block text-[10px] uppercase font-semibold">Capacity</span>
                        <span className="font-bold text-ink-800">{prog.seats || '40 Seats'}</span>
                      </div>
                    </div>

                    {prog.desc && (
                      <p className="text-xs text-ink-600 line-clamp-3 leading-relaxed">{prog.desc}</p>
                    )}

                    {prog.eligibility && (
                      <p className="text-[11px] text-ink-500 bg-amber-50/70 p-2 rounded-lg border border-amber-200/50">
                        <strong>Eligibility:</strong> {prog.eligibility}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-ink-100 flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(prog)}
                      className="text-xs gap-1.5 h-8 font-semibold"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteProgram(prog._id)}
                      className="text-xs gap-1.5 h-8 bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-white stroke-[2.5]" />
                      <span className="text-white font-bold">Delete</span>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Page Stats & Header */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings}>
          <Card className="p-6 bg-white shadow-sm space-y-5 max-w-3xl">
            <h3 className="font-display text-base font-bold text-ink-900 border-b border-ink-100 pb-3">
              Academic Page Header & Institutional Statistics
            </h3>

            <div className="space-y-4">
              <div>
                <Label>Hero Headline (English)</Label>
                <Input
                  value={settings.heroTitle}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  className="bg-white"
                />
              </div>

              <div>
                <Label>Hero Subtitle / Mission Statement</Label>
                <Textarea
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  rows={3}
                  className="bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <Label>Years of Excellence</Label>
                  <Input
                    value={settings.yearsOfExcellence}
                    onChange={(e) => setSettings({ ...settings, yearsOfExcellence: e.target.value })}
                    placeholder="e.g. 25+"
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label>Graduates Produced</Label>
                  <Input
                    value={settings.graduatesProduced}
                    onChange={(e) => setSettings({ ...settings, graduatesProduced: e.target.value })}
                    placeholder="e.g. 8,000+"
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label>Total Academic Programs</Label>
                  <Input
                    value={settings.academicProgramsCount}
                    onChange={(e) => setSettings({ ...settings, academicProgramsCount: e.target.value })}
                    placeholder="e.g. 12"
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label>Research Papers / Batches</Label>
                  <Input
                    value={settings.researchPapers}
                    onChange={(e) => setSettings({ ...settings, researchPapers: e.target.value })}
                    placeholder="e.g. 500+"
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-ink-100 flex justify-end">
              <Button type="submit" loading={savingSettings} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Save Academic Settings
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* TAB 3: Student Inquiries */}
      {activeTab === 'inquiries' && (
        <Card className="p-5 bg-white shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-ink-100 pb-3">
            <h3 className="font-display text-sm font-bold text-ink-900">
              Student Admission Inquiries ({inquiries.length})
            </h3>
            <p className="text-xs text-ink-500">
              Prospective students who submitted admission inquiries via the Academic portal.
            </p>
          </div>

          {inquiries.length === 0 ? (
            <div className="p-12 text-center text-ink-400">
              <Users className="h-8 w-8 mx-auto text-ink-300 mb-2" />
              <p className="text-xs font-semibold text-ink-600">No student inquiries received yet</p>
            </div>
          ) : (
            <div className="divide-y divide-ink-100">
              {inquiries.map((inq: any) => (
                <div key={inq._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-ink-900">{inq.name}</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-semibold">
                        {inq.meta?.program || inq.subject || 'Admission'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-ink-400" />
                        <a href={`tel:${inq.phone}`} className="hover:underline text-blue-600 font-medium">
                          {inq.phone}
                        </a>
                      </span>
                      {inq.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-ink-400" />
                          <a href={`mailto:${inq.email}`} className="hover:underline">
                            {inq.email}
                          </a>
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="h-3 w-3 text-ink-400" />
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {inq.message && (
                      <p className="text-xs text-ink-600 pt-1 leading-relaxed bg-ink-50 p-2 rounded-lg">
                        {inq.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Program Create/Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProgram ? `Edit Program: ${editingProgram.title}` : 'Add Academic Program'}
      >
        <form onSubmit={handleSaveProgram} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Program Title (English) *</Label>
              <Input
                value={programForm.title || ''}
                onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                placeholder="e.g. Diploma in General Medicine (HA)"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Label>Program Title (Nepali)</Label>
              <Input
                value={programForm.titleNp || ''}
                onChange={(e) => setProgramForm({ ...programForm, titleNp: e.target.value })}
                placeholder="e.g. सामान्य चिकित्सा डिप्लोमा"
              />
            </div>

            <div>
              <Label>Duration</Label>
              <Input
                value={programForm.duration || ''}
                onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })}
                placeholder="e.g. 3 Years"
              />
            </div>

            <div>
              <Label>Capacity / Seats</Label>
              <Input
                value={programForm.seats || ''}
                onChange={(e) => setProgramForm({ ...programForm, seats: e.target.value })}
                placeholder="e.g. 40 Seats"
              />
            </div>

            <div>
              <Label>Tag / Discipline</Label>
              <Select
                value={programForm.tag || 'Medical'}
                onChange={(e) => setProgramForm({ ...programForm, tag: e.target.value })}
              >
                <option value="Medical">Medical</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Nursing">Nursing</option>
                <option value="Paramedical">Paramedical</option>
                <option value="Certificate">Certificate</option>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select
                value={programForm.status || 'admissions_open'}
                onChange={(e) => setProgramForm({ ...programForm, status: e.target.value as any })}
              >
                <option value="admissions_open">Admissions Open</option>
                <option value="active">Active (Ongoing)</option>
                <option value="closed">Admissions Closed</option>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Label>Eligibility Criteria</Label>
              <Input
                value={programForm.eligibility || ''}
                onChange={(e) => setProgramForm({ ...programForm, eligibility: e.target.value })}
                placeholder="e.g. SEE / SLC with minimum GPA 2.0 with Science & Math"
              />
            </div>

            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={programForm.desc || ''}
                onChange={(e) => setProgramForm({ ...programForm, desc: e.target.value })}
                rows={3}
                placeholder="Brief summary of syllabus, career scope, and training..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-ink-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={savingProgram} className="bg-[#17372f] hover:bg-[#1f5144] text-white">
              {editingProgram ? 'Update Program' : 'Create Program'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
