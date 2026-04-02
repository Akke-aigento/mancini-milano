import { sellqoFetch } from './client';
import type { Product, Collection, Category, Cart, CheckoutSession, PaginatedResponse, ProductsParams } from './types';

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
    sellqoFetch<Cart>('/cart', { method: 'POST' }),

  get: (cartId: string) =>
    sellqoFetch<Cart>(`/cart/${cartId}`),

  addItem: (cartId: string, item: { product_id: string; variant_id?: string; quantity: number }) =>
    sellqoFetch<Cart>(`/cart/${cartId}/items`, {
      method: 'POST',
      body: JSON.stringify(item),
    }),

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

// === CHECKOUT ===
export const checkoutAPI = {
  start: (cartId: string) =>
    sellqoFetch<{ status: string; items: unknown[]; subtotal: number }>('/checkout', {
      method: 'POST',
      body: JSON.stringify({ cart_id: cartId }),
    }),

  getShippingOptions: (cartId: string, country: string, subtotal: number) =>
    sellqoFetch<{ shipping_methods: Array<{ id: string; name: string; price: number; estimated_days?: string }> }>('/checkout/shipping-options', {
      method: 'POST',
      body: JSON.stringify({ cart_id: cartId, country, subtotal }),
    }),

  getPaymentMethods: (cartId: string) =>
    sellqoFetch<{ payment_methods: Array<{ id: string; type: string; name: string; description?: string }> }>('/checkout/payment-methods', {
      method: 'POST',
      body: JSON.stringify({ cart_id: cartId }),
    }),

  placeOrder: (data: {
    cart_id: string;
    shipping_address: Record<string, string>;
    billing_address?: Record<string, string>;
    email: string;
    phone?: string;
    shipping_method_id: string;
    payment_method: string;
    origin: string;
  }) =>
    sellqoFetch<{ order_id: string; status: string; payment_url?: string; bank_details?: Record<string, string> }>('/checkout/place-order', {
      method: 'POST',
      body: JSON.stringify(data),
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
