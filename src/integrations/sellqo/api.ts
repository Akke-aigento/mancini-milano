import { sellqoFetch } from './client';
import type { Product, Collection, Category, Cart, CheckoutSession, PaginatedResponse, ProductsParams } from './types';

// === PRODUCTS ===
export const productsAPI = {
  getAll: (params?: ProductsParams) =>
    sellqoFetch<PaginatedResponse<Product>>('get_products', {
      ...(params?.category_slug && { category_slug: params.category_slug }),
      ...(params?.category && { category_id: params.category }),
      ...(params?.search && { search: params.search }),
      ...(params?.sort && { sort: params.sort }),
      ...(params?.page && { page: params.page }),
      ...(params?.per_page && { per_page: params.per_page }),
    }),

  getBySlug: (slug: string) =>
    sellqoFetch<Product>('get_product', { slug }),

  getRelated: (slug: string, limit = 4) =>
    sellqoFetch<Product[]>('get_related_products', { slug, limit }),

  search: (query: string, limit = 6) =>
    sellqoFetch<Product[]>('search_products', { query, limit }),
};

// === COLLECTIONS & CATEGORIES ===
export const collectionsAPI = {
  getAll: () =>
    sellqoFetch<Collection[]>('get_collections'),

  getProducts: (slug: string, params?: ProductsParams) =>
    sellqoFetch<PaginatedResponse<Product>>('get_collection_products', {
      slug,
      ...(params?.sort && { sort: params.sort }),
      ...(params?.page && { page: params.page }),
    }),
};

export const categoriesAPI = {
  getAll: () =>
    sellqoFetch<Category[]>('get_categories'),
};

// === CART ===
export const cartAPI = {
  create: () =>
    sellqoFetch<Cart>('create_cart'),

  get: (cartId: string) =>
    sellqoFetch<Cart>('get_cart', { cart_id: cartId }),

  addItem: (cartId: string, item: { product_id: string; variant_id?: string; quantity: number }) =>
    sellqoFetch<Cart>('add_to_cart', { cart_id: cartId, ...item }),

  updateItem: (cartId: string, itemId: string, quantity: number) =>
    sellqoFetch<Cart>('update_cart_item', { cart_id: cartId, item_id: itemId, quantity }),

  removeItem: (cartId: string, itemId: string) =>
    sellqoFetch<Cart>('remove_cart_item', { cart_id: cartId, item_id: itemId }),

  applyDiscount: (cartId: string, code: string) =>
    sellqoFetch<Cart>('apply_discount', { cart_id: cartId, code }),

  removeDiscount: (cartId: string) =>
    sellqoFetch<Cart>('remove_discount', { cart_id: cartId }),
};

// === CHECKOUT ===
export const checkoutAPI = {
  create: (cartId: string, options?: { success_url?: string; cancel_url?: string }) =>
    sellqoFetch<CheckoutSession>('create_checkout', { cart_id: cartId, ...options }),
};

// === NEWSLETTER ===
export const newsletterAPI = {
  subscribe: (email: string) =>
    sellqoFetch<{ success: boolean; message: string }>('subscribe_newsletter', { email }),
};

// === CONTACT ===
export const contactAPI = {
  submit: (data: { name: string; email: string; subject: string; message: string }) =>
    sellqoFetch<{ success: boolean }>('submit_contact', data),
};
