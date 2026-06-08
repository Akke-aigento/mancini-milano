import { sellqoFetch } from './client';
import { getOrCreateSessionId } from './session';
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

  removeDiscount: (cartId: string, code?: string) =>
    sellqoFetch<Cart>(`/cart/${cartId}/discount`, {
      method: 'DELETE',
      ...(code ? { body: JSON.stringify({ code }) } : {}),
    }),
};

// === CHECKOUT (v2 step-by-step flow) ===
export const checkoutAPI = {
  start: (cart_id: string) =>
    sellqoFetch<{
      order_id: string;
      items: Array<{ id: string; title: string; variant_title?: string; quantity: number; price: number; image?: string }>;
      available_payment_methods: Array<{ id: string; type: string; name: string; description?: string; fee?: number; reason_unavailable?: string }>;
      available_shipping_methods: Array<{ id: string; name: string; price: number; estimated_days?: string }>;
      pass_fee_to_customer?: boolean;
      fee_label?: string;
      subtotal: number;
      total: number;
      currency: string;
    }>('/checkout', {
      method: 'POST',
      body: JSON.stringify({ cart_id }),
    }),

  saveCustomer: (cart_id: string, customer: { email: string; first_name: string; last_name: string; phone?: string }) =>
    sellqoFetch<{ success: boolean }>('/checkout/customer', {
      method: 'POST',
      body: JSON.stringify({ cart_id, customer }),
    }),

  saveAddress: (cart_id: string, data: {
    shipping_address: Record<string, string>;
    billing_same_as_shipping: boolean;
    billing_address?: Record<string, string> | null;
  }) =>
    sellqoFetch<{ success: boolean }>('/checkout/address', {
      method: 'POST',
      body: JSON.stringify({ cart_id, ...data }),
    }),

  selectShipping: (cart_id: string, shipping_method_id: string) =>
    sellqoFetch<{ shipping_cost: number; total: number }>('/checkout/shipping', {
      method: 'POST',
      body: JSON.stringify({ cart_id, shipping_method_id }),
    }),

  selectPaymentMethod: (cart_id: string, payment_method_id: string) =>
    sellqoFetch<{ subtotal: number; shipping_cost: number; transaction_fee: number; total: number }>('/checkout/select-payment-method', {
      method: 'POST',
      body: JSON.stringify({ cart_id, payment_method_id }),
    }),

  complete: (cart_id: string, payment_method_id: string, success_url: string, cancel_url: string) =>
    sellqoFetch<{
      payment_type: 'redirect' | 'manual' | 'qr' | 'bank_transfer';
      checkout_url?: string;
      redirect_url?: string;
      order_number?: string;
      total?: number;
      currency?: string;
      bank_details?: Record<string, string>;
      qr_data?: { image_url?: string; payload?: string };
    }>('/checkout/complete', {
      method: 'POST',
      body: JSON.stringify({ cart_id, payment_method_id, success_url, cancel_url }),
    }),

  applyDiscount: (cart_id: string, discount_code: string) =>
    sellqoFetch<{ discount_code?: string; code?: string; discount_amount?: number; amount?: number; value?: number; subtotal?: number; shipping_cost?: number; shippingCost?: number; total?: number }>('/checkout/discount', {
      method: 'POST',
      body: JSON.stringify({ cart_id, discount_code }),
    }),

  removeDiscount: (cart_id: string, discount_code?: string) =>
    sellqoFetch<{ subtotal?: number; shipping_cost?: number; shippingCost?: number; total?: number }>('/checkout/discount', {
      method: 'DELETE',
      body: JSON.stringify({ cart_id, ...(discount_code ? { discount_code } : {}) }),
    }),

  getOrderBySession: (stripe_session_id: string) =>
    sellqoFetch<{ order_id: string; order_number: string; status: string; total: number; currency: string }>(`/checkout/order?stripe_session_id=${encodeURIComponent(stripe_session_id)}`),
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
