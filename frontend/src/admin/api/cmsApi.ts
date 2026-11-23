import apiClient, { type ApiResponse, type ApiMeta } from './client';

export type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  type?: string;
  album?: string;
  teamCategory?: string;
  folder?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  doctor?: string;
  doctorId?: string;
  department?: string;
  appointmentDate?: string;
  [key: string]: any;
};

function toQuery(params: ListParams = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      q.set(key, String(value));
    }
  });
  return q.toString();
}

export async function listResource<T>(
  resource: string,
  params: ListParams = {},
  scope: 'admin' | 'public' = 'admin'
): Promise<{ items: T[]; meta: ApiMeta }> {
  const qs = toQuery(params);
  const { data } = await apiClient.get<ApiResponse<T[]>>(
    `/${scope}/${resource}${qs ? `?${qs}` : ''}`
  );
  return {
    items: data.data || [],
    meta: data.meta || {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };
}

export async function getResource<T>(
  resource: string,
  id: string,
  scope: 'admin' | 'public' = 'admin'
): Promise<T> {
  const { data } = await apiClient.get<ApiResponse<T>>(`/${scope}/${resource}/${id}`);
  return data.data;
}

export async function createResource<T>(resource: string, payload: unknown): Promise<T> {
  const { data } = await apiClient.post<ApiResponse<T>>(`/admin/${resource}`, payload);
  return data.data;
}

export async function updateResource<T>(
  resource: string,
  id: string,
  payload: unknown
): Promise<T> {
  const { data } = await apiClient.put<ApiResponse<T>>(`/admin/${resource}/${id}`, payload);
  return data.data;
}

export async function deleteResource(resource: string, id: string): Promise<void> {
  await apiClient.delete(`/admin/${resource}/${id}`);
}

export async function toggleResourceStatus<T>(resource: string, id: string): Promise<T> {
  const { data } = await apiClient.patch<ApiResponse<T>>(
    `/admin/${resource}/${id}/toggle-status`
  );
  return data.data;
}

export async function getDashboard() {
  const { data } = await apiClient.get<ApiResponse<any>>('/admin/dashboard');
  return data.data;
}

export async function getSettings() {
  const { data } = await apiClient.get<ApiResponse<any>>('/admin/settings');
  return data.data;
}

export async function updateSettings(payload: unknown) {
  const { data } = await apiClient.put<ApiResponse<any>>('/admin/settings', payload);
  return data.data;
}

export interface PageStatusItem {
  pageKey: string;
  path: string;
  name: string;
  status: 'active' | 'blocked';
  noticeTitle?: string;
  noticeMessage?: string;
  updatedAt?: string;
}

export async function getPageStatuses() {
  const { data } = await apiClient.get<ApiResponse<{ items: PageStatusItem[]; meta: { total: number; active: number; blocked: number } }>>(
    '/admin/page-status'
  );
  return data.data;
}

export async function updatePageStatus(
  pageKey: string,
  payload: { status?: 'active' | 'blocked'; noticeTitle?: string; noticeMessage?: string }
) {
  const { data } = await apiClient.put<ApiResponse<PageStatusItem>>(`/admin/page-status/${pageKey}`, payload);
  return data.data;
}

export async function updateAllPageStatuses(pageStatuses: PageStatusItem[]) {
  const { data } = await apiClient.put<ApiResponse<PageStatusItem[]>>('/admin/page-status', { pageStatuses });
  return data.data;
}

export async function getHomepage() {
  const { data } = await apiClient.get<ApiResponse<any>>('/admin/homepage');
  return data.data;
}

export async function updateHomepage(payload: unknown) {
  const { data } = await apiClient.put<ApiResponse<any>>('/admin/homepage', payload);
  return data.data;
}

export async function getAbout() {
  const { data } = await apiClient.get<ApiResponse<any>>('/admin/about');
  return data.data;
}

export async function updateAbout(payload: unknown) {
  const { data } = await apiClient.put<ApiResponse<any>>('/admin/about', payload);
  return data.data;
}

export async function listMedia(params: ListParams = {}) {
  return listResource<any>('media', params, 'admin');
}

export async function getMediaFolders() {
  const { data } = await apiClient.get<ApiResponse<{ name: string; count: number }[]>>(
    '/admin/media/folders'
  );
  return data.data;
}

export async function uploadMedia(file: File, folder = 'general', meta: { alt?: string; title?: string } = {}) {
  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);
  if (meta.alt) form.append('alt', meta.alt);
  if (meta.title) form.append('title', meta.title);
  const { data } = await apiClient.post<ApiResponse<any>>('/admin/media/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function uploadManyMedia(files: File[], folder = 'general') {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));
  form.append('folder', folder);
  const { data } = await apiClient.post<ApiResponse<any[]>>('/admin/media/upload-many', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function replaceMedia(id: string, file: File) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await apiClient.put<ApiResponse<any>>(`/admin/media/${id}/replace`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function updateMediaMeta(id: string, payload: unknown) {
  const { data } = await apiClient.patch<ApiResponse<any>>(`/admin/media/${id}`, payload);
  return data.data;
}

export async function deleteMedia(id: string) {
  await apiClient.delete(`/admin/media/${id}`);
}

/** Doctor Schedules & Appointments Helpers */
export async function getDoctorSchedules() {
  const { data } = await apiClient.get<ApiResponse<any[]>>('/admin/schedules');
  return data.data || [];
}

export async function addDoctorScheduleSlot(payload: {
  doctorId: string;
  day: string;
  shift?: string;
  startTime?: string;
  endTime?: string;
  room?: string;
  maxPatients?: number;
  isActive?: boolean;
}) {
  const { data } = await apiClient.post<ApiResponse<any>>('/admin/schedules', payload);
  return data.data;
}

export async function updateDoctorScheduleSlot(
  doctorId: string,
  slotId: string,
  payload: {
    day?: string;
    shift?: string;
    startTime?: string;
    endTime?: string;
    room?: string;
    maxPatients?: number;
    isActive?: boolean;
  }
) {
  const { data } = await apiClient.put<ApiResponse<any>>(`/admin/schedules/${doctorId}/${slotId}`, payload);
  return data.data;
}

export async function deleteDoctorScheduleSlot(doctorId: string, slotId: string) {
  const { data } = await apiClient.delete<ApiResponse<any>>(`/admin/schedules/${doctorId}/${slotId}`);
  return data.data;
}

export async function updateAppointmentStatus(id: string, status: string, notes?: string) {
  const { data } = await apiClient.patch<ApiResponse<any>>(`/admin/appointments/${id}/status`, { status, notes });
  return data.data;
}

/** Live Updates API */
export async function getLiveUpdates() {
  const { data } = await apiClient.get<ApiResponse<{
    lines: string[];
    settings: { enabled: boolean; badgeTextEn: string; badgeTextNp: string; speed: 'slow' | 'normal' | 'fast' };
    announcements: any[];
  }>>('/admin/live-updates');
  return data.data;
}

export async function updateLiveUpdates(payload: { lines?: string[]; settings?: any }) {
  const { data } = await apiClient.put<ApiResponse<any>>('/admin/live-updates', payload);
  return data.data;
}

export async function addLiveUpdateLine(text: string) {
  const { data } = await apiClient.post<ApiResponse<string[]>>('/admin/live-updates/lines', { text });
  return data.data;
}

export async function deleteLiveUpdateLine(index: number) {
  const { data } = await apiClient.delete<ApiResponse<string[]>>(`/admin/live-updates/lines/${index}`);
  return data.data;
}

/** Academic API */
export interface AcademicProgramItem {
  _id?: string;
  title: string;
  titleNp?: string;
  duration?: string;
  seats?: string;
  tag?: string;
  desc?: string;
  descNp?: string;
  eligibility?: string;
  gradient?: string;
  status: 'active' | 'admissions_open' | 'closed';
  sortOrder?: number;
  iconName?: string;
  brochureUrl?: string;
}

export async function getAcademicData() {
  const { data } = await apiClient.get<ApiResponse<{
    programs: AcademicProgramItem[];
    settings: {
      heroTitle: string;
      heroSubtitle: string;
      yearsOfExcellence: string;
      graduatesProduced: string;
      academicProgramsCount: string;
      researchPapers: string;
      brochureUrl: string;
    };
    inquiriesCount: number;
  }>>('/admin/academic');
  return data.data;
}

export async function updateAcademicSettings(payload: any) {
  const { data } = await apiClient.put<ApiResponse<any>>('/admin/academic/settings', payload);
  return data.data;
}

export async function createAcademicProgram(payload: Partial<AcademicProgramItem>) {
  const { data } = await apiClient.post<ApiResponse<AcademicProgramItem>>('/admin/academic/programs', payload);
  return data.data;
}

export async function updateAcademicProgram(id: string, payload: Partial<AcademicProgramItem>) {
  const { data } = await apiClient.put<ApiResponse<AcademicProgramItem>>(`/admin/academic/programs/${id}`, payload);
  return data.data;
}

export async function deleteAcademicProgram(id: string) {
  const { data } = await apiClient.delete<ApiResponse<any>>(`/admin/academic/programs/${id}`);
  return data.data;
}

export async function getAcademicInquiries() {
  const { data } = await apiClient.get<ApiResponse<any[]>>('/admin/academic/inquiries');
  return data.data;
}

/** Popup Notice API */
export interface PopupNoticeConfig {
  enabled: boolean;
  title: string;
  titleNp: string;
  message: string;
  messageNp: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  displayType: 'image_only' | 'text_only' | 'image_and_text';
  frequency: 'always' | 'once_per_session' | 'once_per_day';
  showCloseButton: boolean;
  updatedAt?: string;
}

export async function getPopupNotice() {
  const { data } = await apiClient.get<ApiResponse<PopupNoticeConfig>>('/admin/popup-notice');
  return data.data;
}

export async function updatePopupNotice(payload: Partial<PopupNoticeConfig>) {
  const { data } = await apiClient.put<ApiResponse<PopupNoticeConfig>>('/admin/popup-notice', payload);
  return data.data;
}

/** Public website API helpers */
export const publicApi = {
  settings: () => apiClient.get<ApiResponse<any>>('/public/settings').then((r) => r.data.data),
  homepage: () => apiClient.get<ApiResponse<any>>('/public/homepage').then((r) => r.data.data),
  about: () => apiClient.get<ApiResponse<any>>('/public/about').then((r) => r.data.data),
  schedules: () => apiClient.get<ApiResponse<any[]>>('/public/schedules').then((r) => r.data.data || []),
  list: <T>(resource: string, params: ListParams = {}) =>
    listResource<T>(resource, { ...params, status: 'published', limit: params.limit || 100 }, 'public'),
  get: <T>(resource: string, id: string) => getResource<T>(resource, id, 'public'),
};
