import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI, collectionsAPI, categoriesAPI, cartAPI, checkoutAPI, newsletterAPI } from './api';
import { extractArray, extractSingle } from './client';
import { normalizeProducts, normalizeProduct, normalizeCollections, normalizeCart, normalizeCategories } from './normalizer';
import type { Cart, Product, Collection, Category, ProductsParams } from './types';

// === QUERY KEYS ===
export const sellqoKeys = {
  products: {
    all: ['sellqo', 'products'] as const,
    list: (params?: ProductsParams) => ['sellqo', 'products', 'list', params] as const,
    detail: (slug: string) => ['sellqo', 'products', 'detail', slug] as const,
    related: (slug: string) => ['sellqo', 'products', 'related', slug] as const,
    search: (query: string) => ['sellqo', 'products', 'search', query] as const,
  },
  collections: {
    all: ['sellqo', 'collections'] as const,
    products: (slug: string, params?: ProductsParams) => ['sellqo', 'collections', 'products', slug, params] as const,
  },
  categories: {
    all: ['sellqo', 'categories'] as const,
  },
  cart: (cartId: string) => ['sellqo', 'cart', cartId] as const,
};

// === PRODUCT HOOKS ===
export function useProducts(params?: ProductsParams) {
  return useQuery({
    queryKey: sellqoKeys.products.list(params),
    queryFn: async () => {
      const res = await productsAPI.getAll(params);
      const raw = extractArray<any>(res);
      return normalizeProducts(raw);
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: sellqoKeys.products.detail(slug),
    queryFn: async () => {
      const res = await productsAPI.getBySlug(slug);
      const raw = extractSingle<any>(res) || res;
      return normalizeProduct(raw);
    },
    enabled: !!slug,
  });
}

export function useRelatedProducts(slug: string) {
  return useQuery({
    queryKey: sellqoKeys.products.related(slug),
    queryFn: async () => {
      const res = await productsAPI.getRelated(slug);
      const raw = extractArray<any>(res);
      return normalizeProducts(raw);
    },
    enabled: !!slug,
  });
}

export function useProductSearch(query: string) {
  return useQuery({
    queryKey: sellqoKeys.products.search(query),
    queryFn: async () => {
      const res = await productsAPI.search(query);
      const raw = extractArray<any>(res);
      return normalizeProducts(raw);
    },
    enabled: query.length >= 2,
  });
}

// === COLLECTION HOOKS ===
export function useCollections() {
  return useQuery({
    queryKey: sellqoKeys.collections.all,
    queryFn: async () => {
      const res = await collectionsAPI.getAll();
      const raw = extractArray<any>(res);
      return normalizeCollections(raw);
    },
  });
}

export function useCollectionProducts(slug: string, params?: ProductsParams) {
  return useQuery({
    queryKey: sellqoKeys.collections.products(slug, params),
    queryFn: async () => {
      const res = await collectionsAPI.getProducts(slug, params);
      const raw = extractArray<any>(res);
      return normalizeProducts(raw);
    },
    enabled: !!slug,
  });
}

// === CATEGORY HOOKS ===
export function useCategories() {
  return useQuery({
    queryKey: sellqoKeys.categories.all,
    queryFn: async () => {
      const res = await categoriesAPI.getAll();
      return extractArray<Category>(res);
    },
  });
}

// === CART HOOKS ===
const CART_STORAGE_KEY = 'mancini_cart_id';

function getStoredCartId(): string | null {
  try {
    const id = localStorage.getItem(CART_STORAGE_KEY);
    if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
      if (id !== null) localStorage.removeItem(CART_STORAGE_KEY);
      return null;
    }
    return id;
  } catch {
    return null;
  }
}

function storeCartId(cartId: string) {
  try { localStorage.setItem(CART_STORAGE_KEY, cartId); } catch { /* noop */ }
}

export function useCartQuery() {
  const cartId = getStoredCartId();
  return useQuery({
    queryKey: sellqoKeys.cart(cartId || ''),
    queryFn: async () => {
      try {
        const result = await cartAPI.get(cartId!);
        const raw = extractSingle<Cart>(result) || result;
        return normalizeCart(raw);
      } catch (err) {
        // Cart doesn't exist anymore — clear stale ID
        console.warn('Cart not found, clearing stored cart ID');
        try { localStorage.removeItem(CART_STORAGE_KEY); } catch { /* noop */ }
        return undefined;
      }
    },
    enabled: !!cartId,
    retry: false,
  });
}

export function useCreateCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const result = await cartAPI.create();
      const raw = extractSingle<Cart>(result) || result;
      return normalizeCart(raw);
    },
    onSuccess: (cart) => {
      storeCartId(cart.id);
      queryClient.setQueryData(sellqoKeys.cart(cart.id), cart);
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const createCart = useCreateCart();

  return useMutation({
    mutationFn: async (item: { product_id: string; variant_id?: string; quantity: number }) => {
      let activeCartId = getStoredCartId();
      if (!activeCartId) {
        const newCart = await createCart.mutateAsync();
        activeCartId = newCart.id;
      }
      const result = await cartAPI.addItem(activeCartId, item);
      const raw = extractSingle<Cart>(result) || result;
      return normalizeCart(raw);
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(sellqoKeys.cart(cart.id), cart);
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const cartId = getStoredCartId();
      if (!cartId) throw new Error('No cart found');
      const result = await cartAPI.updateItem(cartId, itemId, quantity);
      const raw = extractSingle<Cart>(result) || result;
      return normalizeCart(raw);
    },
    onMutate: async ({ itemId, quantity }) => {
      const cartId = getStoredCartId();
      if (!cartId) return;
      await queryClient.cancelQueries({ queryKey: sellqoKeys.cart(cartId) });
      const previousCart = queryClient.getQueryData<Cart>(sellqoKeys.cart(cartId));
      if (previousCart) {
        queryClient.setQueryData<Cart>(sellqoKeys.cart(cartId), {
          ...previousCart,
          items: previousCart.items.map(item => item.id === itemId ? { ...item, quantity } : item),
          item_count: previousCart.items.reduce((sum, item) => sum + (item.id === itemId ? quantity : item.quantity), 0),
        });
      }
      return { previousCart, cartId };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCart && context.cartId) {
        queryClient.setQueryData(sellqoKeys.cart(context.cartId), context.previousCart);
      }
    },
    onSuccess: (cart) => { queryClient.setQueryData(sellqoKeys.cart(cart.id), cart); },
    onSettled: () => {
      const cartId = getStoredCartId();
      if (cartId) queryClient.invalidateQueries({ queryKey: sellqoKeys.cart(cartId) });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      const cartId = getStoredCartId();
      if (!cartId) throw new Error('No cart found');
      const result = await cartAPI.removeItem(cartId, itemId);
      const raw = extractSingle<Cart>(result) || result;
      return normalizeCart(raw);
    },
    onMutate: async (itemId) => {
      const cartId = getStoredCartId();
      if (!cartId) return;
      await queryClient.cancelQueries({ queryKey: sellqoKeys.cart(cartId) });
      const previousCart = queryClient.getQueryData<Cart>(sellqoKeys.cart(cartId));
      if (previousCart) {
        const newItems = previousCart.items.filter(item => item.id !== itemId);
        queryClient.setQueryData<Cart>(sellqoKeys.cart(cartId), {
          ...previousCart,
          items: newItems,
          item_count: newItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        });
      }
      return { previousCart, cartId };
    },
    onError: (_err, _itemId, context) => {
      if (context?.previousCart && context.cartId) {
        queryClient.setQueryData(sellqoKeys.cart(context.cartId), context.previousCart);
      }
    },
    onSuccess: (cart) => { queryClient.setQueryData(sellqoKeys.cart(cart.id), cart); },
    onSettled: () => {
      const cartId = getStoredCartId();
      if (cartId) queryClient.invalidateQueries({ queryKey: sellqoKeys.cart(cartId) });
    },
  });
}

export function useApplyDiscount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => {
      const cartId = getStoredCartId();
      if (!cartId) throw new Error('No cart found');
      const result = code
        ? await cartAPI.applyDiscount(cartId, code)
        : await cartAPI.removeDiscount(cartId);
      const raw = extractSingle<Cart>(result) || result;
      return normalizeCart(raw);
    },
    onSuccess: (cart) => { queryClient.setQueryData(sellqoKeys.cart(cart.id), cart); },
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (options?: { success_url?: string; cancel_url?: string }) => {
      const cartId = getStoredCartId();
      if (!cartId) throw new Error('No cart found');
      return checkoutAPI.create(cartId, options);
    },
    onSuccess: (response: any) => {
      const url = response?.data?.checkout_url || response?.checkout_url || (typeof response === 'string' ? response : null);
      if (url) {
        window.location.href = url;
      } else {
        console.error('Checkout response missing checkout_url:', response);
      }
    },
  });
}

export function useNewsletterSubscribe() {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => newsletterAPI.subscribe(email),
  });
}

export { getStoredCartId, storeCartId, CART_STORAGE_KEY };
