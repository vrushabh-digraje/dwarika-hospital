/**
 * Public website CMS client — reads published content from the backend.
 * Admin mutations live under src/admin/api.
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export type CmsListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Request failed: ${res.status}`);
  }
  return json.data as T;
}

export async function fetchPublicList<T>(
  resource: string,
  params: Record<string, string | number | undefined> = {}
): Promise<{ items: T[]; meta?: CmsListMeta }> {
  const qs = new URLSearchParams();
  Object.entries({ status: 'published', limit: 100, ...params }).forEach(([k, v]) => {
    if (v !== undefined && v !== '') qs.set(k, String(v));
  });
  const res = await fetch(`${API_BASE}/public/${resource}?${qs}`);
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || 'Failed to load content');
  }
  return { items: json.data || [], meta: json.meta };
}

export async function fetchPublicOne<T>(resource: string, id: string): Promise<T> {
  return request<T>(`/public/${resource}/${id}`);
}

export const cmsPublic = {
  settings: () => request<any>('/public/settings'),
  homepage: () => request<any>('/public/homepage'),
  about: () => request<any>('/public/about'),
  doctors: (params?: Record<string, string | number>) => fetchPublicList<any>('doctors', params),
  departments: () => fetchPublicList<any>('departments'),
  services: () => fetchPublicList<any>('services'),
  facilities: () => fetchPublicList<any>('facilities'),
  gallery: (params?: Record<string, string | number>) => fetchPublicList<any>('gallery', params),
  testimonials: () => fetchPublicList<any>('testimonials'),
  blogs: () => fetchPublicList<any>('blogs'),
  blog: (id: string) => fetchPublicOne<any>('blogs', id),
  events: () => fetchPublicList<any>('events'),
  event: (id: string) => fetchPublicOne<any>('events', id),
  downloads: () => fetchPublicList<any>('downloads'),
  faqs: () => fetchPublicList<any>('faqs'),
  announcements: () => fetchPublicList<any>('announcements'),
  videos: () => fetchPublicList<any>('videos'),
  packages: () => fetchPublicList<any>('health-packages'),
  partners: () => fetchPublicList<any>('partners'),
  insurance: () => fetchPublicList<any>('insurance'),
  seo: () => fetchPublicList<any>('seo'),
};

export async function submitEnquiry(payload: unknown) {
  return request('/public/enquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function submitAppointment(payload: unknown) {
  return request('/public/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
