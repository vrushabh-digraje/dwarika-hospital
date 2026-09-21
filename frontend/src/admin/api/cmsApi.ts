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

/** Public website API helpers */
export const publicApi = {
  settings: () => apiClient.get<ApiResponse<any>>('/public/settings').then((r) => r.data.data),
  homepage: () => apiClient.get<ApiResponse<any>>('/public/homepage').then((r) => r.data.data),
  about: () => apiClient.get<ApiResponse<any>>('/public/about').then((r) => r.data.data),
  list: <T>(resource: string, params: ListParams = {}) =>
    listResource<T>(resource, { ...params, status: 'published', limit: params.limit || 100 }, 'public'),
  get: <T>(resource: string, id: string) => getResource<T>(resource, id, 'public'),
};
