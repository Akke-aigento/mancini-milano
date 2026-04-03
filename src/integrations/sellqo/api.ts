import { sellqoFetch } from './client';
import type { Product, Collection, Category, Cart, PaginatedResponse, ProductsParams } from './types';

// === PRODUCTS ===
export const productsAPI = {
  getAll: (params?: ProductsParams) => {
    const sp = new URLSearchParams();
    if (params?.category_slug) sp.set('category_slug', params.category_slug);
    if (params?.category) sp.set('category', params.category);
    if (params?.search) sp.set('search', params.search);
    if (params?.sort) sp.set('sort', params.sort);
    if (params?.page) sp.set('page', String(params.page));
    if (params?.per_page) sp.set('per_page', String(params.per_page));
    const qs = sp.toString();
    return sellqoFetch<PaginatedResponse<Product>>(`/products${qs ? `?${qs}` : ''}`);
  },

  getBySlug: (slug: string) =>
    sellqoFetch<Product>(`/products/${slug}`),

  getRelated: (slug: string, limit = 4) =>
    sellqoFetch<Product[]>(`/products/${slug}/related?limit=${limit}`),

  search: (query: string, limit = 6) =>
    sellqoFetch<Product[]>(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`),
};

// === COLLECTIONS & CATEGORIES ===
export const collectionsAPI = {
  getAll: () =>
    sellqoFetch<Collection[]>('/collections'),

  getProducts: (slug: string, params?: ProductsParams) => {
    const sp = new URLSearchParams();
    if (params?.sort) sp.set('sort', params.sort);
    if (params?.page) sp.set('page', String(params.page));
    const qs = sp.toString();
    return sellqoFetch<PaginatedResponse<Product>>(`/collections/${slug}/products${qs ? `?${qs}` : ''}`);
  },
};

export const categoriesAPI = {
  getAll: () =>
    sellqoFetch<Category[]>('/categories'),
};

// === CART ===
export const cartAPI = {
  create: () =>
    sellqoFetch<Cart>('/cart', {
      method: 'POST',
      body: JSON.stringify({ session_id: crypto.randomUUID() }),
    }),

  get: (cartId: string) =>
    sellqoFetch<Cart>(`/cart/${cartId}`),

  addItem: (cartId: string, item: { product_id: string; variant_id?: string; quantity: number }) => {
    const payload: Record<string, unknown> = { product_id: item.product_id, quantity: item.quantity };
    if (item.variant_id) payload.variant_id = item.variant_id;
    return sellqoFetch<Cart>(`/cart/${cartId}/items`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateItem: (cartId: string, itemId: string, quantity: number) =>
    sellqoFetch<Cart>(`/cart/${cartId}/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  removeItem: (cartId: string, itemId: string) =>
    sellqoFetch<Cart>(`/cart/${cartId}/items/${itemId}`, { method: 'DELETE' }),

  applyDiscount: (cartId: string, code: string) =>
    sellqoFetch<Cart>(`/cart/${cartId}/discount`, {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  removeDiscount: (cartId: string) =>
    sellqoFetch<Cart>(`/cart/${cartId}/discount`, { method: 'DELETE' }),
};

// === CHECKOUT (v2 step-by-step flow) ===
export const checkoutAPI = {
  start: (cart_id: string) =>
    sellqoFetch<{
      order_id: string;
      items: Array<{ id: string; title: string; variant_title?: string; quantity: number; price: number; image?: string }>;
      available_payment_methods: Array<{ id: string; type: string; name: string; description?: string }>;
      available_shipping_methods: Array<{ id: string; name: string; price: number; estimated_days?: string }>;
      subtotal: number;
      total: number;
      currency: string;
    }>('/checkout', {
      method: 'POST',
      body: JSON.stringify({ cart_id }),
    }),

  saveCustomer: (order_id: string, customer: { email: string; first_name: string; last_name: string; phone?: string }) =>
    sellqoFetch<{ success: boolean }>('/checkout/customer', {
      method: 'POST',
      body: JSON.stringify({ order_id, customer }),
    }),

  saveAddress: (order_id: string, data: {
    shipping_address: Record<string, string>;
    billing_same_as_shipping: boolean;
    billing_address?: Record<string, string> | null;
  }) =>
    sellqoFetch<{ success: boolean }>('/checkout/address', {
      method: 'POST',
      body: JSON.stringify({ order_id, ...data }),
    }),

  selectShipping: (order_id: string, shipping_method_id: string) =>
    sellqoFetch<{ shipping_cost: number; total: number }>('/checkout/shipping', {
      method: 'POST',
      body: JSON.stringify({ order_id, shipping_method_id }),
    }),

  complete: (order_id: string, payment_method_id: string, success_url: string, cancel_url: string) =>
    sellqoFetch<{
      payment_type: 'redirect' | 'manual' | 'qr';
      checkout_url?: string;
      order_number?: string;
      total?: number;
      currency?: string;
      bank_details?: Record<string, string>;
      qr_data?: { image_url?: string; payload?: string };
    }>('/checkout/complete', {
      method: 'POST',
      body: JSON.stringify({ order_id, payment_method_id, success_url, cancel_url }),
    }),

  applyDiscount: (order_id: string, discount_code: string) =>
    sellqoFetch<{ discount_code: string; discount_amount: number; total: number }>('/checkout/discount', {
      method: 'POST',
      body: JSON.stringify({ order_id, discount_code }),
    }),

  removeDiscount: (order_id: string) =>
    sellqoFetch<{ total: number }>('/checkout/discount', {
      method: 'DELETE',
      body: JSON.stringify({ order_id }),
    }),

  getConfirmation: (orderId: string) =>
    sellqoFetch<{ order_id: string; status: string; total: number; items: unknown[] }>(`/checkout/confirmation/${orderId}`),
};

// === NEWSLETTER ===
export const newsletterAPI = {
  subscribe: (email: string) =>
    sellqoFetch<{ success: boolean; message: string }>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

// === CONTACT ===
export const contactAPI = {
  submit: (data: { name: string; email: string; subject: string; message: string }) =>
    sellqoFetch<{ success: boolean }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
