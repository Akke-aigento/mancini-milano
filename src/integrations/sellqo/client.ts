// SellQo Storefront API Client - routes through proxy edge function
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SELLQO_PROXY_BASE = `${SUPABASE_URL}/functions/v1/sellqo-proxy`;
const SELLQO_TENANT_ID = '2606c5b9-caf8-4a42-94cd-80e3f3f31988';

/**
 * Safely extract an array from an API response
 */
export function extractArray<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response;
  if (response && typeof response === 'object') {
    const r = response as Record<string, unknown>;
    if (r.data && typeof r.data === 'object' && !Array.isArray(r.data)) {
      const inner = r.data as Record<string, unknown>;
      if (Array.isArray(inner.products)) return inner.products as T[];
      if (Array.isArray(inner.items)) return inner.items as T[];
      if (Array.isArray(inner.data)) return inner.data as T[];
      if (Array.isArray(inner.categories)) return inner.categories as T[];
      if (Array.isArray(inner.results)) return inner.results as T[];
    }
    if (Array.isArray(r.data)) return r.data as T[];
    if (Array.isArray(r.products)) return r.products as T[];
    if (Array.isArray(r.items)) return r.items as T[];
    if (Array.isArray(r.results)) return r.results as T[];
    if (Array.isArray(r.categories)) return r.categories as T[];
  }
  return [];
}

/**
 * Extract a single object from API response
 */
export function extractSingle<T>(response: unknown): T | null {
  if (!response || typeof response !== 'object') return null;
  const r = response as Record<string, unknown>;
  if (r.data && typeof r.data === 'object' && !Array.isArray(r.data)) {
    return r.data as T;
  }
  if (r.id) return r as unknown as T;
  return null;
}

export async function sellqoFetch<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${SELLQO_PROXY_BASE}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Tenant-ID': SELLQO_TENANT_ID,
  };

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });
  } catch (err) {
    console.error('SellQo network error:', err);
    throw new Error('NETWORK_ERROR');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    console.error(`SellQo API error (${res.status}):`, error);
    throw new Error(error.message || error.error || `SellQo API error: ${res.status}`);
  }

  return res.json();
}
