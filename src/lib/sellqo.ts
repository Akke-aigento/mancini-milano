import { getMockData } from './mock-data';

const SELLQO_API_BASE = import.meta.env.VITE_SELLQO_API_URL || '';
const SELLQO_TENANT_ID = import.meta.env.VITE_SELLQO_TENANT_ID || 'mancinimilano';
const USE_MOCK_DATA = !SELLQO_API_BASE;

let currentLocale = 'en';

export function setSellqoLocale(locale: string) {
  currentLocale = locale;
}

export async function sellqoFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (USE_MOCK_DATA) {
    return getMockData(endpoint, options) as T;
  }

  const res = await fetch(`${SELLQO_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-ID': SELLQO_TENANT_ID,
      'Accept-Language': currentLocale,
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`SellQo API error: ${res.status}`);
  return res.json();
}

export function mapProduct(raw: any) {
  if (!raw) return null;
  const isGiftCard = raw.price === 0 || raw.name?.toLowerCase().includes('gift');
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.name || raw.title || '',
    name: raw.name || raw.title || '',
    description: raw.description || '',
    price: raw.price || 0,
    compare_at_price: raw.compare_at_price,
    currency: raw.currency || 'EUR',
    images: Array.isArray(raw.images)
      ? raw.images.map((img: any) =>
          typeof img === 'string' ? { url: img, alt: raw.name || '' } : img
        )
      : [],
    variants: (raw.variants || []).map((v: any) => ({
      id: v.id,
      title: v.title || v.name || '',
      price: v.price ?? raw.price ?? 0,
      sku: v.sku,
      stock_status: (v.stock ?? v.stock_quantity ?? 1) <= 0 ? 'out_of_stock' : 'in_stock',
      stock_quantity: v.stock || v.stock_quantity,
      options: v.options || {},
      image: v.image,
    })),
    category: raw.category ? {
      id: raw.category.id,
      slug: raw.category.slug,
      name: raw.category.name,
    } : undefined,
    tags: raw.tags || [],
    in_stock: raw.in_stock !== false,
    has_variants: raw.has_variants || false,
    price_range: raw.price_range,
    is_gift_card: isGiftCard,
    is_featured: raw.is_featured || false,
    created_at: raw.created_at || '',
  };
}

export function mapCollection(raw: any) {
  if (!raw) return null;
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.name || raw.title || '',
    name: raw.name || raw.title || '',
    description: raw.description || '',
    image: raw.image_url || raw.image || '',
    product_count: raw.product_count || 0,
    parent_id: raw.parent_id,
  };
}

export function extractProducts(response: any) {
  const raw = response?.data?.products || response?.data?.data?.products || response?.data || response || [];
  const products = Array.isArray(raw) ? raw : [];
  const pagination = response?.data?.pagination || response?.pagination || {};
  return {
    products: products.map(mapProduct).filter(Boolean),
    total: pagination.total_count || pagination.total || products.length,
    page: pagination.page || 1,
    total_pages: pagination.total_pages || 1,
  };
}

export function extractCollections(response: any) {
  const raw = response?.data?.data || response?.data || response || [];
  const collections = Array.isArray(raw) ? raw : [];
  return collections.map(mapCollection).filter(Boolean);
}

export function extractProduct(response: any) {
  const raw = response?.data?.product || response?.data?.data || response?.data || response;
  return mapProduct(raw);
}

export const getProducts = (params?: string) => sellqoFetch(`/products${params ? `?${params}` : ''}`);
export const getProduct = (slug: string) => sellqoFetch(`/products/${slug}`);
export const getProductRelated = (slug: string) => sellqoFetch(`/products/${slug}/related?limit=4`);
export const getCollections = () => sellqoFetch('/collections');
export const getCollectionProducts = (slug: string, params?: string) => sellqoFetch(`/collections/${slug}/products${params ? `?${params}` : ''}`);
export const searchProducts = (query: string) => sellqoFetch(`/products/search?q=${encodeURIComponent(query)}&limit=6`);
export const createCart = () => sellqoFetch('/cart', { method: 'POST' });
export const getCart = (cartId: string) => sellqoFetch(`/cart/${cartId}`);
export const addToCart = (cartId: string, item: { product_id: string; variant_id?: string; quantity: number }) =>
  sellqoFetch(`/cart/${cartId}/items`, { method: 'POST', body: JSON.stringify(item) });
export const updateCartItem = (cartId: string, itemId: string, quantity: number) =>
  sellqoFetch(`/cart/${cartId}/items/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) });
export const removeCartItem = (cartId: string, itemId: string) =>
  sellqoFetch(`/cart/${cartId}/items/${itemId}`, { method: 'DELETE' });
export const applyDiscount = (cartId: string, code: string) =>
  sellqoFetch(`/cart/${cartId}/discount`, { method: 'POST', body: JSON.stringify({ code }) });
export const createCheckout = (cartId: string, successUrl: string, cancelUrl: string) =>
  sellqoFetch('/checkout', { method: 'POST', body: JSON.stringify({ cart_id: cartId, success_url: successUrl, cancel_url: cancelUrl }) });
export const subscribeNewsletter = (email: string) =>
  sellqoFetch('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
export const submitContact = (data: { name: string; email: string; subject: string; message: string }) =>
  sellqoFetch('/contact', { method: 'POST', body: JSON.stringify(data) });
export const getSettings = () => sellqoFetch('/settings');
export const getLegalPages = () => sellqoFetch('/pages?type=legal');
