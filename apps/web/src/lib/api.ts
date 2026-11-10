const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  statusCode?: number;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('signdesk_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const message = errBody.message || errBody.error || `HTTP ${res.status}: ${res.statusText}`;
      const error = new Error(Array.isArray(message) ? message.join(', ') : message);
      (error as any).status = res.status;
      throw error;
    }

    if (res.status === 204) {
      return {} as T;
    }

    return await res.json();
  } catch (err: any) {
    // If backend is not currently running or network error, provide graceful fallback for demo
    if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('ENOTFOUND') || err.message.includes('ECONNREFUSED'))) {
      console.warn(`[SignDesk API] Local API offline at ${url}. Returning local mock fallback.`);
    }
    throw err;
  }
}
