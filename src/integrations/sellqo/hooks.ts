import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI, collectionsAPI, categoriesAPI, cartAPI, checkoutAPI, newsletterAPI, shippingAPI } from './api';
import { extractArray, extractSingle, SellQoError } from './client';
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
  shippingCountries: ['sellqo', 'shipping', 'countries'] as const,
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
      const raw = extractArray<any>(res);
      return normalizeCategories(raw);
    },
  });
}

// === CART HOOKS ===
const CART_STORAGE_KEY = 'mancini_cart_id';
const ORPHANED_CARTS_KEY = 'mancini_orphaned_carts';

function readStorage(key: string): string | null {
  try {
    const v = localStorage.getItem(key);
    if (v && v !== 'undefined' && v !== 'null' && v.trim() !== '') return v;
  } catch { /* noop */ }
  try {
    const v = sessionStorage.getItem(key);
    if (v && v !== 'undefined' && v !== 'null' && v.trim() !== '') return v;
  } catch { /* noop */ }
  return null;
}

function getStoredCartId(): string | null {
  const id = readStorage(CART_STORAGE_KEY);
  if (!id) {
    try { localStorage.removeItem(CART_STORAGE_KEY); } catch { /* noop */ }
    try { sessionStorage.removeItem(CART_STORAGE_KEY); } catch { /* noop */ }
    return null;
  }
  return id;
}

function clearStoredCartId() {
  try { localStorage.removeItem(CART_STORAGE_KEY); } catch { /* noop */ }
  try { sessionStorage.removeItem(CART_STORAGE_KEY); } catch { /* noop */ }
}

// Returns null for responses without a usable cart. cart_get returns
// { success: true, data: null } for an expired (30 days) cart.
function readCart(result: unknown): Cart | null {
  const raw = extractSingle<Cart>(result);
  if (!raw) return null;
  const cart = normalizeCart(raw);
  return cart?.id ? cart : null;
}

// Errors that mean the stored cart id is unusable (expired, not found, malformed).
// Matches on code or message only: upstream returns 500 for these, so status is not reliable.
function isStaleCartError(err: unknown): boolean {
  if (err instanceof SellQoError && err.code && /CART_NOT_FOUND|CART_EXPIRED|INVALID_CART/.test(err.code)) return true;
  const message = err instanceof Error ? err.message : '';
  return /cart.*(not found|expired|invalid)|invalid input syntax for type uuid|invalid.*uuid/i.test(message);
}

function storeCartId(cartId: string) {
  try { localStorage.setItem(CART_STORAGE_KEY, cartId); } catch { /* noop */ }
  try { sessionStorage.setItem(CART_STORAGE_KEY, cartId); } catch { /* noop */ }
}

function markCartOrphaned(cartId: string) {
  try {
    const raw = localStorage.getItem(ORPHANED_CARTS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(cartId)) list.push(cartId);
    localStorage.setItem(ORPHANED_CARTS_KEY, JSON.stringify(list.slice(-20)));
  } catch { /* noop */ }
}

// In-flight guard: prevents a second cart_create from racing inside the same
// browser session (the 19:54 + 20:22 duplicate-cart scenario).
let inFlightCartCreate: Promise<Cart> | null = null;

async function createCartIdempotent(): Promise<Cart> {
  const existing = getStoredCartId();
  if (existing) {
    try {
      const cart = readCart(await cartAPI.get(existing));
      if (cart) return cart;
    } catch {
      // stale id — fall through and create a fresh one
    }
    clearStoredCartId();
  }
  if (inFlightCartCreate) {
    return inFlightCartCreate;
  }
  inFlightCartCreate = (async () => {
    try {
      const result = await cartAPI.create();
      const raw = extractSingle<Cart>(result) || result;
      const cart = normalizeCart(raw);
      storeCartId(cart.id);
      return cart;
    } finally {
      inFlightCartCreate = null;
    }
  })();
  return inFlightCartCreate;
}

export function useCartQuery() {
  const cartId = getStoredCartId();
  return useQuery({
    queryKey: sellqoKeys.cart(cartId || ''),
    queryFn: async () => {
      try {
        const cart = readCart(await cartAPI.get(cartId!));
        // data: null means the cart expired — clear stale ID
        if (!cart) clearStoredCartId();
        return cart ?? undefined;
      } catch (err) {
        // Cart doesn't exist anymore — clear stale ID
        console.warn('Cart not found, clearing stored cart ID');
        clearStoredCartId();
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
    mutationFn: createCartIdempotent,
    onSuccess: (cart) => {
      storeCartId(cart.id);
      queryClient.setQueryData(sellqoKeys.cart(cart.id), cart);
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: { product_id: string; variant_id?: string; quantity: number }) => {
      const attempt = async () => {
        const cart = await createCartIdempotent();
        const result = await cartAPI.addItem(cart.id, item);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body = result as any;
        if (body?.success === false) {
          throw new SellQoError(
            typeof body.error === 'string' ? body.error : body.error?.message || 'Add to cart failed',
            { code: body.error_code ?? body.error?.code, details: body.error_details },
          );
        }
        const updated = readCart(result);
        // cartAddItem does not check expires_at, so an item can land in a just-expired cart.
        if (!updated) throw new SellQoError('cart expired', { code: 'CART_EXPIRED' });
        return updated;
      };
      try {
        return await attempt();
      } catch (err) {
        if (!isStaleCartError(err)) throw err;
        // Stored cart is unusable: start a fresh cart and retry once.
        clearStoredCartId();
        return await attempt();
      }
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
    onSettled: () => {
      const cartId = getStoredCartId();
      if (cartId) queryClient.invalidateQueries({ queryKey: sellqoKeys.cart(cartId) });
    },
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (options?: { success_url?: string; cancel_url?: string }) => {
      const cartId = getStoredCartId();
      if (!cartId) throw new Error('No cart found');
      return checkoutAPI.start(cartId);
    },
    onSuccess: (response: any) => {
      console.log('Checkout started:', response);
    },
  });
}

export interface ShippingCountriesInfo {
  countries: string[];
  unrestricted: boolean;
  default_country: string | null;
}

export function useShippingCountries() {
  return useQuery<ShippingCountriesInfo>({
    queryKey: sellqoKeys.shippingCountries,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await shippingAPI.getCountries();
      const raw = (extractSingle<any>(res) || res) as any;
      const codes = Array.isArray(raw?.countries) ? raw.countries : [];
      return {
        countries: codes.map((c: string) => String(c).toUpperCase()),
        unrestricted: raw?.unrestricted === true,
        default_country: raw?.default_country ? String(raw.default_country).toUpperCase() : null,
      };
    },
  });
}

export function useNewsletterSubscribe() {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => newsletterAPI.subscribe(email),
  });
}

export { getStoredCartId, storeCartId, markCartOrphaned, createCartIdempotent, CART_STORAGE_KEY, ORPHANED_CARTS_KEY };
