const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Shared POST helper used by website forms.
 * Maps legacy mock paths onto the CMS backend.
 */
export const postData = async (url: string, data: unknown) => {
  const normalized = url.replace(/^\//, '');
  let endpoint = `${API_BASE}/${normalized}`;

  if (normalized === 'appointments' || normalized.endsWith('appointments')) {
    endpoint = `${API_BASE}/public/appointments`;
  } else if (normalized === 'api/inquiry' || normalized === 'inquiry' || normalized.endsWith('inquiry')) {
    endpoint = `${API_BASE}/inquiry`;
  } else if (normalized.startsWith('api/')) {
    endpoint = `${API_BASE}/${normalized.slice(4)}`;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.message || 'Request failed');
  }
  return json;
};
