// SellQo Storefront API Client — Direct POST to SellQo API
const SELLQO_API_URL = 'https://sellqo.app/api/storefront';
const SELLQO_TENANT_ID = '2606c5b9-caf8-4a42-94cd-80e3f3f31988';

export async function sellqoFetch<T = unknown>(
  action: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(SELLQO_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action,
      tenant_id: SELLQO_TENANT_ID,
      ...params,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    console.error(`SellQo API error (${res.status}):`, error);
    throw new Error(error.message || error.error || `SellQo API error: ${res.status}`);
  }

  return res.json();
}

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
