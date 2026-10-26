import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck2,
  Clock,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  Calendar,
  User,
  Phone,
  Mail,
  Stethoscope,
  Building2,
  Trash2,
  Edit3,
  Eye,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  listResource,
  createResource,
  updateResource,
  deleteResource,
  getDoctorSchedules,
  addDoctorScheduleSlot,
  updateDoctorScheduleSlot,
  deleteDoctorScheduleSlot,
  updateAppointmentStatus,
} from '../api/cmsApi';
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  Input,
  LoadingBlock,
  Modal,
  PageHeader,
  Pagination,
  Select,
} from '../components/ui';
import { formatDate, truncate, cn } from '../lib/format';
import { resolveImageUrl } from '../../lib/utils';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

const SHIFT_OPTIONS = [
  { id: 'Morning', label: 'Morning (08:00 AM – 12:00 PM)', defaultStart: '08:00 AM', defaultEnd: '12:00 PM' },
  { id: 'Afternoon', label: 'Afternoon (12:00 PM – 04:00 PM)', defaultStart: '12:00 PM', defaultEnd: '04:00 PM' },
  { id: 'Evening', label: 'Evening (04:00 PM – 07:00 PM)', defaultStart: '04:00 PM', defaultEnd: '07:00 PM' },
  { id: 'Night', label: 'Night / Emergency (07:00 PM – 08:00 AM)', defaultStart: '07:00 PM', defaultEnd: '11:00 PM' },
];

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'appointments' | 'schedules'>('appointments');

  // Appointments state
  const [appointments, setAppointments] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0, limit: 10, hasNext: false, hasPrev: false });
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grouped'>('table');

  // Doctor Schedules state
  const [doctorsWithSchedules, setDoctorsWithSchedules] = useState<any[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [scheduleDoctorFilter, setScheduleDoctorFilter] = useState('');
  const [scheduleDayFilter, setScheduleDayFilter] = useState('');

  // Modals & Inspectors
  const [inspectorAppointment, setInspectorAppointment] = useState<any | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<{ doctorId: string; slot: any } | null>(null);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<any | null>(null);
  const [deletingSlot, setDeletingSlot] = useState<{ doctorId: string; slotId: string; doctorName: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusBusyId, setStatusBusyId] = useState<string | null>(null);

  // Form states
  const [slotForm, setSlotForm] = useState({
    doctorId: '',
    day: 'Sunday',
    shift: 'Morning',
    startTime: '08:00 AM',
    endTime: '12:00 PM',
    room: 'OPD Room 101',
    maxPatients: 20,
    isActive: true,
  });

  const [appointmentForm, setAppointmentForm] = useState({
    patientName: '',
    phone: '',
    email: '',
    gender: 'Male',
    dob: '',
    department: 'Cardiology',
    doctor: '',
    doctorId: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    shift: 'Morning (08:00 AM - 12:00 PM)',
    message: '',
    notes: '',
    status: 'pending',
  });

  // Load Appointments
  const loadAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    try {
      const res = await listResource<any>('appointments', {
        page,
        limit: 12,
        search: search || undefined,
        status: statusFilter || undefined,
        doctor: doctorFilter || undefined,
      });
      setAppointments(res.items);
      setMeta(res.meta);
    } catch (e: any) {
      toast.error(e.message || 'Failed to load appointments');
    } finally {
      setLoadingAppointments(false);
    }
  }, [page, search, statusFilter, doctorFilter]);

  // Load Doctor Schedules
  const loadSchedules = useCallback(async () => {
    setLoadingSchedules(true);
    try {
      const docs = await getDoctorSchedules();
      setDoctorsWithSchedules(docs);
    } catch (e: any) {
      toast.error(e.message || 'Failed to load doctor schedules');
    } finally {
      setLoadingSchedules(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  // Summary counts
  const kpiCounts = useMemo(() => {
    const total = meta.total || appointments.length;
    const pending = appointments.filter((a) => a.status === 'pending').length;
    const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
    const completed = appointments.filter((a) => a.status === 'completed').length;
    const cancelled = appointments.filter((a) => a.status === 'cancelled').length;
    return { total, pending, confirmed, completed, cancelled };
  }, [appointments, meta.total]);

  // Unique doctors from schedule list or appointments
  const doctorList = useMemo(() => {
    return doctorsWithSchedules.map((d) => ({
      id: d._id,
      name: d.name,
      specialty: d.specialty,
      category: d.category,
      imageUrl: d.imageUrl,
    }));
  }, [doctorsWithSchedules]);

  // Quick Status Updater
  const handleQuickStatus = async (appointmentId: string, newStatus: string) => {
    setStatusBusyId(appointmentId);
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      toast.success(`Appointment marked as ${newStatus}`);
      if (inspectorAppointment?._id === appointmentId) {
        setInspectorAppointment((prev: any) => ({ ...prev, status: newStatus }));
      }
      await loadAppointments();
    } catch (e: any) {
      toast.error(e.message || 'Failed to update status');
    } finally {
      setStatusBusyId(null);
    }
  };

  // Open Schedule Modal for create
  const openAddSchedule = (defaultDocId?: string, defaultDay?: string) => {
    const docId = defaultDocId || (doctorsWithSchedules[0]?._id ?? '');
    setEditingSlot(null);
    setSlotForm({
      doctorId: docId,
      day: defaultDay || 'Sunday',
      shift: 'Morning',
      startTime: '08:00 AM',
      endTime: '12:00 PM',
      room: 'OPD Room 101',
      maxPatients: 20,
      isActive: true,
    });
    setScheduleModalOpen(true);
  };

  // Open Schedule Modal for edit
  const openEditSchedule = (doctor: any, slot: any) => {
    setEditingSlot({ doctorId: doctor._id, slot });
    setSlotForm({
      doctorId: doctor._id,
      day: slot.day || 'Sunday',
      shift: slot.shift || 'Morning',
      startTime: slot.startTime || '08:00 AM',
      endTime: slot.endTime || '12:00 PM',
      room: slot.room || 'OPD Room 101',
      maxPatients: slot.maxPatients || 20,
      isActive: slot.isActive !== false,
    });
    setScheduleModalOpen(true);
  };

  // Save Schedule Slot
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotForm.doctorId || !slotForm.day) {
      toast.error('Please select Doctor and Day of Week');
      return;
    }
    setSaving(true);
    try {
      if (editingSlot) {
        await updateDoctorScheduleSlot(editingSlot.doctorId, editingSlot.slot._id, slotForm);
        toast.success('Schedule slot updated successfully');
      } else {
        await addDoctorScheduleSlot(slotForm);
        toast.success('New schedule slot added successfully');
      }
      setScheduleModalOpen(false);
      await loadSchedules();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  // Delete Schedule Slot
  const handleDeleteSlot = async () => {
    if (!deletingSlot) return;
    setSaving(true);
    try {
      await deleteDoctorScheduleSlot(deletingSlot.doctorId, deletingSlot.slotId);
      toast.success('Schedule slot removed');
      setDeletingSlot(null);
      await loadSchedules();
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete schedule slot');
    } finally {
      setSaving(false);
    }
  };

  // Open Appointment Form (Create/Edit)
  const openAppointmentForm = (item?: any) => {
    if (item) {
      setEditingAppointment(item);
      setAppointmentForm({
        patientName: item.patientName || '',
        phone: item.phone || '',
        email: item.email || '',
        gender: item.gender || 'Male',
        dob: item.dob || '',
        department: item.department || 'Cardiology',
        doctor: item.doctor || '',
        doctorId: item.doctorId || '',
        appointmentDate: item.appointmentDate ? item.appointmentDate.split('T')[0] : '',
        shift: item.shift || 'Morning',
        message: item.message || '',
        notes: item.notes || '',
        status: item.status || 'pending',
      });
    } else {
      setEditingAppointment(null);
      const defaultDoc = doctorsWithSchedules[0];
      setAppointmentForm({
        patientName: '',
        phone: '',
        email: '',
        gender: 'Male',
        dob: '',
        department: defaultDoc?.category || 'Cardiology',
        doctor: defaultDoc?.name || '',
        doctorId: defaultDoc?._id || '',
        appointmentDate: new Date().toISOString().split('T')[0],
        shift: 'Morning (08:00 AM - 12:00 PM)',
        message: '',
        notes: '',
        status: 'confirmed',
      });
    }
    setAppointmentModalOpen(true);
  };

  // Save Appointment Form
  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentForm.patientName || !appointmentForm.doctor) {
      toast.error('Patient Name and Doctor are required');
      return;
    }
    setSaving(true);
    try {
      if (editingAppointment?._id) {
        await updateResource('appointments', editingAppointment._id, appointmentForm);
        toast.success('Appointment updated');
      } else {
        await createResource('appointments', appointmentForm);
        toast.success('Appointment booked successfully');
      }
      setAppointmentModalOpen(false);
      await loadAppointments();
    } catch (e: any) {
      toast.error(e.message || 'Failed to save appointment');
    } finally {
      setSaving(false);
    }
  };

  // Delete Appointment
  const handleDeleteAppointment = async () => {
    if (!deletingAppointment?._id) return;
    try {
      await deleteResource('appointments', deletingAppointment._id);
      toast.success('Appointment removed');
      setDeletingAppointment(null);
      await loadAppointments();
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete appointment');
    }
  };

  // Filtered schedules
  const filteredDoctorsForSchedule = useMemo(() => {
    return doctorsWithSchedules.filter((doc) => {
      if (scheduleDoctorFilter && doc._id !== scheduleDoctorFilter) return false;
      return true;
    });
  }, [doctorsWithSchedules, scheduleDoctorFilter]);

  // Appointments grouped by doctor
  const appointmentsByDoctor = useMemo(() => {
    const map = new Map<string, any[]>();
    appointments.forEach((app) => {
      const docName = app.doctor || 'Unassigned Doctor';
      if (!map.has(docName)) map.set(docName, []);
      map.get(docName)!.push(app);
    });
    return Array.from(map.entries());
  }, [appointments]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title="Appointments & Doctor Schedules"
        description="Comprehensive management of patient appointments across all doctors, doctor-wise appointments, and OPD weekly duty schedules."
        breadcrumbs={[{ label: 'CMS' }, { label: 'Operations' }, { label: 'Appointments' }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                loadAppointments();
                loadSchedules();
              }}
              title="Refresh Data"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
            <Button
              variant="outline"
              onClick={() => openAddSchedule()}
              className="border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            >
              <Clock className="h-4 w-4 text-emerald-700" /> + Add Doctor Schedule
            </Button>
            <Button onClick={() => openAppointmentForm()}>
              <Plus className="h-4 w-4" /> + Book Appointment
            </Button>
          </div>
        }
      />

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-ink-200 bg-white px-4 pt-2 rounded-2xl shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('appointments')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-bold transition-all cursor-pointer',
            activeTab === 'appointments'
              ? 'border-brand-600 text-brand-700 font-extrabold'
              : 'border-transparent text-ink-500 hover:text-ink-900'
          )}
        >
          <CalendarCheck2 className="h-4 w-4" />
          <span>View Appointments (All Doctors' Appointments)</span>
          <span className="ml-1 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-800">
            {meta.total || appointments.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('schedules')}
          className={cn(
            'flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-bold transition-all cursor-pointer',
            activeTab === 'schedules'
              ? 'border-brand-600 text-brand-700 font-extrabold'
              : 'border-transparent text-ink-500 hover:text-ink-900'
          )}
        >
          <Clock className="h-4 w-4" />
          <span>Doctor Schedules & OPD Roster (Add Schedule)</span>
          <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
            {doctorsWithSchedules.reduce((acc, d) => acc + (d.schedule?.length || 0), 0)} Slots
          </span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: VIEW APPOINTMENTS (ALL DOCTORS' APPOINTMENTS)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'appointments' && (
        <div className="space-y-5">
          {/* Summary Metric Counters */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <Card
              className={cn(
                'cursor-pointer p-4 transition hover:shadow-md',
                !statusFilter ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-200' : ''
              )}
              onClick={() => {
                setStatusFilter('');
                setPage(1);
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">All Appointments</span>
                <CalendarCheck2 className="h-4 w-4 text-brand-600" />
              </div>
              <p className="mt-1 font-display text-2xl font-black text-ink-900">{kpiCounts.total}</p>
              <p className="text-[10px] text-ink-400 mt-0.5">Click to view all</p>
            </Card>

            <Card
              className={cn(
                'cursor-pointer p-4 transition hover:shadow-md',
                statusFilter === 'pending' ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' : ''
              )}
              onClick={() => {
                setStatusFilter(statusFilter === 'pending' ? '' : 'pending');
                setPage(1);
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Pending</span>
                <Clock3 className="h-4 w-4 text-amber-600" />
              </div>
              <p className="mt-1 font-display text-2xl font-black text-amber-800">{kpiCounts.pending}</p>
              <p className="text-[10px] text-amber-600/80 mt-0.5">Awaiting confirmation</p>
            </Card>

            <Card
              className={cn(
                'cursor-pointer p-4 transition hover:shadow-md',
                statusFilter === 'confirmed' ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : ''
              )}
              onClick={() => {
                setStatusFilter(statusFilter === 'confirmed' ? '' : 'confirmed');
                setPage(1);
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Confirmed</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="mt-1 font-display text-2xl font-black text-emerald-800">{kpiCounts.confirmed}</p>
              <p className="text-[10px] text-emerald-600/80 mt-0.5">Approved visits</p>
            </Card>

            <Card
              className={cn(
                'cursor-pointer p-4 transition hover:shadow-md',
                statusFilter === 'completed' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : ''
              )}
              onClick={() => {
                setStatusFilter(statusFilter === 'completed' ? '' : 'completed');
                setPage(1);
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Completed</span>
                <Check className="h-4 w-4 text-blue-600" />
              </div>
              <p className="mt-1 font-display text-2xl font-black text-blue-800">{kpiCounts.completed}</p>
              <p className="text-[10px] text-blue-600/80 mt-0.5">Visit finished</p>
            </Card>

            <Card
              className={cn(
                'cursor-pointer p-4 transition hover:shadow-md',
                statusFilter === 'cancelled' ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-200' : ''
              )}
              onClick={() => {
                setStatusFilter(statusFilter === 'cancelled' ? '' : 'cancelled');
                setPage(1);
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Cancelled</span>
                <XCircle className="h-4 w-4 text-rose-600" />
              </div>
              <p className="mt-1 font-display text-2xl font-black text-rose-800">{kpiCounts.cancelled}</p>
              <p className="text-[10px] text-rose-600/80 mt-0.5">Cancelled / No-show</p>
            </Card>
          </div>

          {/* Filter Toolbar */}
          <Card className="p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <Input
                  className="pl-9"
                  placeholder="Search by patient name, phone, email, symptoms…"
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                />
              </div>

              {/* Filter by Doctor */}
              <div className="w-full lg:w-64">
                <Select
                  value={doctorFilter}
                  onChange={(e) => {
                    setPage(1);
                    setDoctorFilter(e.target.value);
                  }}
                >
                  <option value="">🩺 All Doctors' Appointments</option>
                  {doctorList.map((doc) => (
                    <option key={doc.id} value={doc.name}>
                      {doc.name} ({doc.category || 'General'})
                    </option>
                  ))}
                </Select>
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-40">
                <Select
                  value={statusFilter}
                  onChange={(e) => {
                    setPage(1);
                    setStatusFilter(e.target.value);
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">🟡 Pending</option>
                  <option value="confirmed">🟢 Confirmed</option>
                  <option value="completed">🔵 Completed</option>
                  <option value="cancelled">🔴 Cancelled</option>
                </Select>
              </div>

              {/* View Layout Switcher */}
              <div className="flex items-center gap-1 bg-ink-100 p-1 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={cn(
                    'px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer',
                    viewMode === 'table' ? 'bg-white text-ink-900 shadow-xs' : 'text-ink-600 hover:text-ink-900'
                  )}
                >
                  Table View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grouped')}
                  className={cn(
                    'px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer',
                    viewMode === 'grouped' ? 'bg-white text-ink-900 shadow-xs' : 'text-ink-600 hover:text-ink-900'
                  )}
                >
                  Group by Doctor
                </button>
              </div>
            </div>
          </Card>

          {/* Loading */}
          {loadingAppointments ? (
            <LoadingBlock label="Loading appointments…" />
          ) : appointments.length === 0 ? (
            <EmptyState
              title="No appointments found"
              description="No patient appointments match the selected filters. You can book an appointment manually or wait for online submissions."
              action={
                <Button onClick={() => openAppointmentForm()}>
                  <Plus className="h-4 w-4" /> Book First Appointment
                </Button>
              }
            />
          ) : viewMode === 'table' ? (
            /* ── VIEW 1: TABLE VIEW ── */
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-ink-50/80 text-xs uppercase tracking-wide text-ink-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Patient Information</th>
                      <th className="px-4 py-3 font-semibold">Assigned Doctor</th>
                      <th className="px-4 py-3 font-semibold">Department</th>
                      <th className="px-4 py-3 font-semibold">Visit Date & Shift</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {appointments.map((item) => (
                      <tr key={item._id} className="hover:bg-brand-50/30 transition">
                        {/* Patient info */}
                        <td className="px-4 py-3.5 align-middle">
                          <div className="font-bold text-ink-900">{item.patientName}</div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-ink-500">
                            {item.phone && (
                              <span className="flex items-center gap-1 font-mono">
                                <Phone className="h-3 w-3 text-ink-400" />
                                {item.phone}
                              </span>
                            )}
                            {item.gender && (
                              <span className="rounded-md bg-ink-100 px-1.5 py-0.2 text-[10px] text-ink-700">
                                {item.gender}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Doctor */}
                        <td className="px-4 py-3.5 align-middle">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs shrink-0">
                              <Stethoscope className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <div className="font-semibold text-ink-900">{item.doctor || 'Unassigned'}</div>
                              {item.doctorId && (
                                <span className="text-[10px] text-brand-700 font-medium">Registered Doctor</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="px-4 py-3.5 align-middle">
                          <span className="inline-flex items-center gap-1 rounded-xl bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-800">
                            <Building2 className="h-3 w-3 text-ink-500" />
                            {item.department || 'General'}
                          </span>
                        </td>

                        {/* Date & Shift */}
                        <td className="px-4 py-3.5 align-middle">
                          <div className="flex items-center gap-1.5 font-medium text-ink-900">
                            <Calendar className="h-3.5 w-3.5 text-brand-600" />
                            <span>{formatDate(item.appointmentDate)}</span>
                          </div>
                          {item.shift && (
                            <div className="mt-0.5 text-xs text-ink-500 flex items-center gap-1">
                              <Clock className="h-3 w-3 text-ink-400" />
                              <span>{item.shift}</span>
                            </div>
                          )}
                        </td>

                        {/* Status + 1-Click Status buttons */}
                        <td className="px-4 py-3.5 align-middle">
                          <div className="space-y-1.5">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider',
                                item.status === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.status === 'completed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : item.status === 'cancelled'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-amber-100 text-amber-800'
                              )}
                            >
                              <span
                                className={cn(
                                  'h-1.5 w-1.5 rounded-full',
                                  item.status === 'confirmed'
                                    ? 'bg-emerald-600'
                                    : item.status === 'completed'
                                      ? 'bg-blue-600'
                                      : item.status === 'cancelled'
                                        ? 'bg-rose-600'
                                        : 'bg-amber-600'
                                )}
                              />
                              {item.status || 'pending'}
                            </span>

                            {/* Quick status change buttons */}
                            <div className="flex items-center gap-1">
                              {item.status !== 'confirmed' && item.status !== 'completed' && (
                                <button
                                  type="button"
                                  disabled={statusBusyId === item._id}
                                  onClick={() => handleQuickStatus(item._id, 'confirmed')}
                                  className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer"
                                  title="Confirm Appointment"
                                >
                                  ✓ Confirm
                                </button>
                              )}
                              {item.status === 'confirmed' && (
                                <button
                                  type="button"
                                  disabled={statusBusyId === item._id}
                                  onClick={() => handleQuickStatus(item._id, 'completed')}
                                  className="rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
                                  title="Mark as Completed"
                                >
                                  ✓ Complete
                                </button>
                              )}
                              {item.status !== 'cancelled' && (
                                <button
                                  type="button"
                                  disabled={statusBusyId === item._id}
                                  onClick={() => handleQuickStatus(item._id, 'cancelled')}
                                  className="rounded-lg bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                                  title="Cancel Appointment"
                                >
                                  ✕ Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right align-middle">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setInspectorAppointment(item)}
                              title="View Full Appointment Details"
                            >
                              <Eye className="h-4 w-4 text-brand-700" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openAppointmentForm(item)}
                              title="Edit Appointment"
                            >
                              <Edit3 className="h-4 w-4 text-ink-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeletingAppointment(item)}
                              title="Delete Appointment"
                            >
                              <Trash2 className="h-4 w-4 text-rose-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={meta.page} totalPages={meta.totalPages} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </Card>
          ) : (
            /* ── VIEW 2: GROUPED BY DOCTOR VIEW ── */
            <div className="space-y-4">
              {appointmentsByDoctor.map(([docName, docAppointments]) => (
                <Card key={docName} className="p-5 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink-100 pb-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold text-ink-900">{docName}</h3>
                        <p className="text-xs text-ink-500">
                          {docAppointments[0]?.department || 'Hospital OPD'} •{' '}
                          <span className="font-bold text-brand-700">{docAppointments.length} Appointments</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const doc = doctorsWithSchedules.find((d) => d.name === docName);
                          openAddSchedule(doc?._id);
                        }}
                      >
                        <Clock className="h-3.5 w-3.5" /> Manage Doctor Schedule
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          const doc = doctorsWithSchedules.find((d) => d.name === docName);
                          openAppointmentForm({ doctor: docName, doctorId: doc?._id, department: doc?.category });
                        }}
                      >
                        <Plus className="h-3.5 w-3.5" /> Book for {docName.split(' ')[1] || 'Doctor'}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 divide-y divide-ink-100">
                    {docAppointments.map((app) => (
                      <div
                        key={app._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 hover:bg-ink-50/50 px-2 rounded-xl transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-ink-900">{app.patientName}</span>
                            <span
                              className={cn(
                                'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase',
                                app.status === 'confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : app.status === 'completed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : app.status === 'cancelled'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-amber-100 text-amber-800'
                              )}
                            >
                              ● {app.status}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-ink-500">
                            <span>📅 {formatDate(app.appointmentDate)}</span>
                            {app.shift && <span>⏰ {app.shift}</span>}
                            {app.phone && <span>📞 {app.phone}</span>}
                          </div>
                          {app.message && (
                            <p className="mt-1 text-xs text-ink-600 italic">"{truncate(app.message, 80)}"</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {app.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-emerald-700 border-emerald-200 bg-emerald-50 text-xs"
                              onClick={() => handleQuickStatus(app._id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => setInspectorAppointment(app)}>
                            <Eye className="h-4 w-4 text-brand-700" /> Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: DOCTOR SCHEDULES & OPD ROSTER (ADD & MANAGE SCHEDULES)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'schedules' && (
        <div className="space-y-5">
          {/* Schedule Controls */}
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Filter Doctor */}
                <div className="w-full sm:w-64">
                  <Select
                    value={scheduleDoctorFilter}
                    onChange={(e) => setScheduleDoctorFilter(e.target.value)}
                  >
                    <option value="">🩺 All Doctors' Schedules</option>
                    {doctorList.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.category || 'General'})
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Filter Day */}
                <div className="w-full sm:w-48">
                  <Select
                    value={scheduleDayFilter}
                    onChange={(e) => setScheduleDayFilter(e.target.value)}
                  >
                    <option value="">📅 All Days of Week</option>
                    {DAYS_OF_WEEK.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <Button
                onClick={() => openAddSchedule()}
                className="bg-emerald-700 hover:bg-emerald-800 text-white shrink-0"
              >
                <Plus className="h-4 w-4" /> Add Doctor Schedule Slot
              </Button>
            </div>
          </Card>

          {/* Weekly Timetable Matrix (Sunday to Saturday) */}
          {!scheduleDoctorFilter && (
            <Card className="p-4 overflow-hidden">
              <div className="flex items-center justify-between border-b border-ink-100 pb-3 mb-4">
                <div>
                  <h3 className="font-display text-base font-bold text-ink-900">Weekly OPD Duty Timetable</h3>
                  <p className="text-xs text-ink-500">Live roster of which doctors are available each day across hospital OPD clinics.</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-brand-50 text-brand-800">
                  7-Day Schedule Matrix
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                {DAYS_OF_WEEK.map((day) => {
                  if (scheduleDayFilter && scheduleDayFilter !== day) return null;

                  // Find all doctors on duty this day
                  const slotsForDay: { doctor: any; slot: any }[] = [];
                  doctorsWithSchedules.forEach((doc) => {
                    (doc.schedule || []).forEach((slot: any) => {
                      if (slot.day === day && slot.isActive !== false) {
                        slotsForDay.push({ doctor: doc, slot });
                      }
                    });
                  });

                  return (
                    <div
                      key={day}
                      className="rounded-2xl border border-ink-200 bg-ink-50/50 p-3 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-ink-200 pb-2 mb-2.5">
                          <span className="font-display font-extrabold text-sm text-ink-900 uppercase tracking-tight">
                            {day}
                          </span>
                          <span className="text-[11px] font-bold text-brand-700 bg-white px-2 py-0.5 rounded-full border border-ink-200">
                            {slotsForDay.length}
                          </span>
                        </div>

                        {slotsForDay.length === 0 ? (
                          <div className="py-6 text-center text-xs text-ink-400">No OPD scheduled</div>
                        ) : (
                          <div className="space-y-2">
                            {slotsForDay.map(({ doctor, slot }) => (
                              <div
                                key={slot._id}
                                className="group relative rounded-xl border border-ink-200 bg-white p-2.5 shadow-2xs hover:border-brand-300 transition"
                              >
                                <div className="font-bold text-xs text-ink-900 leading-snug truncate">
                                  {doctor.name}
                                </div>
                                <div className="text-[11px] text-brand-700 font-medium truncate">
                                  {doctor.specialty || doctor.category}
                                </div>
                                <div className="mt-1 text-[10px] font-semibold text-ink-600 flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-ink-400" />
                                  <span>{slot.startTime} – {slot.endTime}</span>
                                </div>
                                {slot.room && (
                                  <div className="text-[10px] text-ink-500 truncate mt-0.5">
                                    📍 {slot.room}
                                  </div>
                                )}
                                <div className="mt-1.5 pt-1.5 border-t border-ink-100 flex items-center justify-between text-[10px]">
                                  <span className="text-ink-400">Cap: {slot.maxPatients || 20}</span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => openEditSchedule(doctor, slot)}
                                      className="p-1 hover:text-brand-700 cursor-pointer"
                                      title="Edit slot"
                                    >
                                      <Edit3 className="h-3 w-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setDeletingSlot({ doctorId: doctor._id, slotId: slot._id, doctorName: doctor.name })
                                      }
                                      className="p-1 hover:text-rose-600 cursor-pointer"
                                      title="Delete slot"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => openAddSchedule(undefined, day)}
                        className="mt-3 w-full rounded-xl border border-dashed border-ink-300 py-1.5 text-center text-xs font-semibold text-brand-700 hover:border-brand-500 hover:bg-brand-50 transition cursor-pointer"
                      >
                        + Add Slot
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Doctor-by-Doctor Schedule Cards */}
          <div className="space-y-4">
            <h3 className="font-display text-base font-bold text-ink-900">Doctor-wise Schedule Roster</h3>

            {loadingSchedules ? (
              <LoadingBlock label="Loading doctor schedules…" />
            ) : filteredDoctorsForSchedule.length === 0 ? (
              <EmptyState
                title="No doctors found"
                description="Please ensure doctor profiles have been created under the Doctors section."
              />
            ) : (
              filteredDoctorsForSchedule.map((doc) => {
                const slots = (doc.schedule || []).filter((s: any) => {
                  if (scheduleDayFilter && s.day !== scheduleDayFilter) return false;
                  return true;
                });

                return (
                  <Card key={doc._id} className="p-5">
                    {/* Doctor Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink-100 pb-4">
                      <div className="flex items-center gap-3.5">
                        {doc.imageUrl ? (
                          <img
                            src={resolveImageUrl(doc.imageUrl)}
                            alt={doc.name}
                            className="h-12 w-12 rounded-2xl object-cover ring-2 ring-ink-100"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-2xl bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-sm">
                            <Stethoscope className="h-6 w-6" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display text-lg font-bold text-ink-900">{doc.name}</h4>
                            <span className="rounded-lg bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                              {doc.category || 'General'}
                            </span>
                          </div>
                          <p className="text-xs text-ink-500 mt-0.5">
                            {doc.specialty || 'Consultant Specialist'} •{' '}
                            <span className="font-semibold text-ink-700">{doc.schedule?.length || 0} Total Weekly Slots</span>
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => openAddSchedule(doc._id)}
                        className="bg-brand-700 hover:bg-brand-800 text-white shrink-0"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Slot for {doc.name.split(' ')[1] || 'Doctor'}
                      </Button>
                    </div>

                    {/* Schedule Slots Table */}
                    <div className="mt-4 overflow-x-auto">
                      {slots.length === 0 ? (
                        <div className="py-6 text-center text-sm text-ink-400">
                          No schedule slots assigned for this doctor. Click "+ Add Slot" above to set up their duty hours.
                        </div>
                      ) : (
                        <table className="min-w-full text-left text-xs">
                          <thead className="bg-ink-50 text-ink-500 uppercase tracking-wider font-semibold">
                            <tr>
                              <th className="px-3.5 py-2.5">Day of Week</th>
                              <th className="px-3.5 py-2.5">Shift</th>
                              <th className="px-3.5 py-2.5">Timing</th>
                              <th className="px-3.5 py-2.5">OPD Room / Clinic</th>
                              <th className="px-3.5 py-2.5">Max Patients</th>
                              <th className="px-3.5 py-2.5">Status</th>
                              <th className="px-3.5 py-2.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-ink-100">
                            {slots.map((slot: any) => (
                              <tr key={slot._id} className="hover:bg-brand-50/20 transition">
                                <td className="px-3.5 py-2.5 font-bold text-ink-900">{slot.day}</td>
                                <td className="px-3.5 py-2.5 font-semibold text-brand-700">{slot.shift || 'Morning'}</td>
                                <td className="px-3.5 py-2.5 font-mono text-ink-800 font-semibold">
                                  {slot.startTime} – {slot.endTime}
                                </td>
                                <td className="px-3.5 py-2.5 text-ink-700">{slot.room || 'General OPD'}</td>
                                <td className="px-3.5 py-2.5 text-ink-700 font-semibold">{slot.maxPatients || 20} Patients</td>
                                <td className="px-3.5 py-2.5">
                                  <span
                                    className={cn(
                                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                                      slot.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                    )}
                                  >
                                    ● {slot.isActive !== false ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td className="px-3.5 py-2.5 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      type="button"
                                      onClick={() => openEditSchedule(doc, slot)}
                                      className="p-1 rounded-lg text-ink-600 hover:bg-ink-100 transition cursor-pointer"
                                      title="Edit slot"
                                    >
                                      <Edit3 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setDeletingSlot({ doctorId: doc._id, slotId: slot._id, doctorName: doc.name })
                                      }
                                      className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                      title="Delete slot"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: ADD / EDIT DOCTOR SCHEDULE SLOT
      ───────────────────────────────────────────────────────────── */}
      <Modal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title={editingSlot ? 'Edit Doctor Schedule Slot' : 'Add Doctor Schedule Slot'}
      >
        <form onSubmit={handleSaveSchedule} className="space-y-4 text-sm">
          {/* Doctor Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
              Select Doctor <span className="text-red-500">*</span>
            </label>
            <Select
              value={slotForm.doctorId}
              onChange={(e) => setSlotForm({ ...slotForm, doctorId: e.target.value })}
              required
            >
              <option value="">-- Choose Doctor --</option>
              {doctorList.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} — {doc.specialty || doc.category}
                </option>
              ))}
            </Select>
          </div>

          {/* Day of Week */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
                Day of Week <span className="text-red-500">*</span>
              </label>
              <Select
                value={slotForm.day}
                onChange={(e) => setSlotForm({ ...slotForm, day: e.target.value })}
                required
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
                Shift Preset
              </label>
              <Select
                value={slotForm.shift}
                onChange={(e) => {
                  const shift = e.target.value;
                  const preset = SHIFT_OPTIONS.find((s) => s.id === shift);
                  setSlotForm({
                    ...slotForm,
                    shift,
                    startTime: preset?.defaultStart || slotForm.startTime,
                    endTime: preset?.defaultEnd || slotForm.endTime,
                  });
                }}
              >
                {SHIFT_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
                Start Time
              </label>
              <Input
                value={slotForm.startTime}
                onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                placeholder="e.g. 08:00 AM"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
                End Time
              </label>
              <Input
                value={slotForm.endTime}
                onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                placeholder="e.g. 12:00 PM"
                required
              />
            </div>
          </div>

          {/* OPD Room and Max Patients */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
                OPD Room / Clinic
              </label>
              <Input
                value={slotForm.room}
                onChange={(e) => setSlotForm({ ...slotForm, room: e.target.value })}
                placeholder="e.g. OPD Room 101"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
                Max Patient Capacity
              </label>
              <Input
                type="number"
                min={1}
                max={150}
                value={slotForm.maxPatients}
                onChange={(e) => setSlotForm({ ...slotForm, maxPatients: parseInt(e.target.value) || 20 })}
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActive"
              checked={slotForm.isActive}
              onChange={(e) => setSlotForm({ ...slotForm, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-ink-800">
              Active Schedule (Available for booking)
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-ink-100">
            <Button type="button" variant="outline" onClick={() => setScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving Slot…' : editingSlot ? 'Update Slot' : 'Add Slot'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: BOOK / EDIT APPOINTMENT FORM
      ───────────────────────────────────────────────────────────── */}
      <Modal
        open={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        title={editingAppointment ? 'Edit Patient Appointment' : 'Book New Patient Appointment'}
      >
        <form onSubmit={handleSaveAppointment} className="space-y-4 text-sm">
          {/* Patient Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
                Patient Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={appointmentForm.patientName}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, patientName: e.target.value })}
                placeholder="e.g. Ram Bahadur Thapa"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                value={appointmentForm.phone}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })}
                placeholder="e.g. 9841234567"
                required
              />
            </div>
          </div>

          {/* Email & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">Email</label>
              <Input
                type="email"
                value={appointmentForm.email}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, email: e.target.value })}
                placeholder="e.g. patient@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">Gender</label>
              <Select
                value={appointmentForm.gender}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>
          </div>

          {/* Doctor & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
                Select Doctor <span className="text-red-500">*</span>
              </label>
              <Select
                value={appointmentForm.doctor}
                onChange={(e) => {
                  const docName = e.target.value;
                  const doc = doctorList.find((d) => d.name === docName);
                  setAppointmentForm({
                    ...appointmentForm,
                    doctor: docName,
                    doctorId: doc?.id || '',
                    department: doc?.category || appointmentForm.department,
                  });
                }}
                required
              >
                <option value="">-- Choose Doctor --</option>
                {doctorList.map((doc) => (
                  <option key={doc.id} value={doc.name}>
                    {doc.name} ({doc.category || 'General'})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">Department</label>
              <Input
                value={appointmentForm.department}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, department: e.target.value })}
                placeholder="e.g. Cardiology"
              />
            </div>
          </div>

          {/* Appointment Date & Shift */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
                Appointment Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={appointmentForm.appointmentDate}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, appointmentDate: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">Shift</label>
              <Select
                value={appointmentForm.shift}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, shift: e.target.value })}
              >
                <option value="Morning (08:00 AM - 12:00 PM)">Morning (08:00 AM - 12:00 PM)</option>
                <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                <option value="Evening (04:00 PM - 07:00 PM)">Evening (04:00 PM - 07:00 PM)</option>
              </Select>
            </div>
          </div>

          {/* Reason / Symptoms */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">
              Reason for Visit / Reported Symptoms
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-ink-200 p-2.5 text-xs text-ink-900 focus:border-brand-500 focus:outline-none"
              value={appointmentForm.message}
              onChange={(e) => setAppointmentForm({ ...appointmentForm, message: e.target.value })}
              placeholder="e.g. Chest tightness, shortness of breath…"
            />
          </div>

          {/* Status & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">Status</label>
              <Select
                value={appointmentForm.status}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1.5">Internal Notes</label>
              <Input
                value={appointmentForm.notes}
                onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                placeholder="e.g. VIP patient, ECG requested"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-ink-100">
            <Button type="button" variant="outline" onClick={() => setAppointmentModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingAppointment ? 'Update Appointment' : 'Book Appointment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: APPOINTMENT INSPECTOR (FULL DETAILS)
      ───────────────────────────────────────────────────────────── */}
      <Modal
        open={!!inspectorAppointment}
        onClose={() => setInspectorAppointment(null)}
        title="Patient Appointment Details"
        wide
      >
        {inspectorAppointment && (
          <div className="space-y-6 text-sm">
            {/* Header Ribbon */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#17372f] to-[#246453] text-white shadow-md">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">{inspectorAppointment.patientName}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-emerald-100">
                    {inspectorAppointment.phone && (
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="h-3 w-3" /> {inspectorAppointment.phone}
                      </span>
                    )}
                    {inspectorAppointment.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {inspectorAppointment.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                    inspectorAppointment.status === 'confirmed'
                      ? 'bg-emerald-500 text-white'
                      : inspectorAppointment.status === 'completed'
                        ? 'bg-blue-500 text-white'
                        : inspectorAppointment.status === 'cancelled'
                          ? 'bg-rose-500 text-white'
                          : 'bg-amber-400 text-amber-950'
                  )}
                >
                  ● {inspectorAppointment.status || 'Pending'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleQuickStatus(inspectorAppointment._id, 'confirmed')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition cursor-pointer"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickStatus(inspectorAppointment._id, 'completed')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition cursor-pointer"
                  >
                    Complete
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickStatus(inspectorAppointment._id, 'cancelled')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-ink-100 bg-ink-50/50 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-500">Doctor & Visit Schedule</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-ink-100">
                    <span className="text-ink-500">Assigned Doctor:</span>
                    <span className="font-bold text-ink-900">{inspectorAppointment.doctor || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-100">
                    <span className="text-ink-500">Department:</span>
                    <span className="font-semibold text-brand-700">{inspectorAppointment.department || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-100">
                    <span className="text-ink-500">Appointment Date:</span>
                    <span className="font-bold text-ink-900">{formatDate(inspectorAppointment.appointmentDate)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-ink-500">Preferred Shift:</span>
                    <span className="font-medium text-ink-800">{inspectorAppointment.shift || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-ink-100 bg-ink-50/50 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-500">Patient Profile</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-ink-100">
                    <span className="text-ink-500">Gender / DOB:</span>
                    <span className="font-semibold text-ink-900">
                      {inspectorAppointment.gender || '—'} {inspectorAppointment.dob ? `(${inspectorAppointment.dob})` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-100">
                    <span className="text-ink-500">Phone:</span>
                    <span className="font-mono text-ink-900">{inspectorAppointment.phone || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-ink-100">
                    <span className="text-ink-500">Email:</span>
                    <span className="text-ink-900">{inspectorAppointment.email || '—'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-ink-500">Address / City:</span>
                    <span className="text-ink-900">
                      {inspectorAppointment.address?.city || 'Janakpurdham'}, {inspectorAppointment.address?.province || 'Madhesh'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Problem / Message */}
            {inspectorAppointment.message && (
              <div className="rounded-2xl border border-ink-100 p-4 bg-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-1">
                  Reason for Consultation / Symptoms
                </h4>
                <p className="text-xs text-ink-800 leading-relaxed">{inspectorAppointment.message}</p>
              </div>
            )}

            {/* Internal Notes */}
            {inspectorAppointment.notes && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">Internal Clinical Notes</h4>
                <p className="text-xs text-amber-900">{inspectorAppointment.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setInspectorAppointment(null);
                  openAppointmentForm(inspectorAppointment);
                }}
              >
                <Edit3 className="h-4 w-4" /> Edit Appointment
              </Button>
              <Button onClick={() => setInspectorAppointment(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Appointment Confirm Dialog */}
      <ConfirmDialog
        open={!!deletingAppointment}
        onClose={() => setDeletingAppointment(null)}
        onConfirm={handleDeleteAppointment}
        title="Delete Appointment"
        message={`Are you sure you want to delete appointment for ${deletingAppointment?.patientName}? This action cannot be undone.`}
        confirmLabel="Delete"
      />

      {/* Delete Schedule Slot Confirm Dialog */}
      <ConfirmDialog
        open={!!deletingSlot}
        onClose={() => setDeletingSlot(null)}
        onConfirm={handleDeleteSlot}
        title="Delete Schedule Slot"
        message={`Are you sure you want to remove this schedule slot for ${deletingSlot?.doctorName}?`}
        confirmLabel="Remove Slot"
      />
    </div>
  );
}
