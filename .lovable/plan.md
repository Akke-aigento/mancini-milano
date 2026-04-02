

# Mancini Milano — SellQo Backend Integration

## Overview
Replace the mock data layer with live SellQo Storefront API calls. The API uses **POST requests** to a single endpoint with `action` + `tenant_id` in the body. We'll adopt the proven architecture from Loveke/Vanxcel (types, normalizer, api module, React Query hooks, CartContext) adapted for direct API calls (no proxy needed).

## Architecture

```text
src/integrations/sellqo/
├── client.ts        # Core POST fetch + extractArray/extractSingle helpers
├── types.ts         # TypeScript interfaces (Product, Cart, Collection, etc.)
├── normalizer.ts    # Raw API → frontend types mapping
├── api.ts           # API modules (productsAPI, cartAPI, checkoutAPI, etc.)
├── hooks.ts         # React Query hooks + query keys
└── CartContext.tsx   # Cart state provider using SellQo cart API
```

## Phase 1: Core API Layer (must work first)

### 1. `client.ts` — SellQo POST client
- Single `sellqoFetch(action, params)` function that POSTs to `https://sellqo.app/api/storefront`
- Body: `{ action, tenant_id: "2606c5b9-caf8-4a42-94cd-80e3f3f31988", ...params }`
- `extractArray<T>()` and `extractSingle<T>()` helpers (from Loveke pattern)

### 2. `types.ts` — Full TypeScript types
- Product, ProductImage, ProductVariant, Collection, Category, Cart, CartItem, CheckoutSession, PaginatedResponse, ProductsParams
- Copied from Loveke with minor adjustments

### 3. `normalizer.ts` — Data normalization
- `normalizeProduct()`, `normalizeCollection()`, `normalizeCart()`, `normalizeCartItem()`
- Maps raw API fields (e.g. `name` → `title`, `attribute_values` → `options`, `stock` → `stock_status`)

### 4. `api.ts` — API modules
- `productsAPI.getAll()`, `.getBySlug(slug)`, `.getRelated(slug)`, `.search(query)`
- `collectionsAPI.getAll()`, `.getProducts(slug)`
- `categoriesAPI.getAll()`
- `cartAPI.create()`, `.get()`, `.addItem()`, `.updateItem()`, `.removeItem()`, `.applyDiscount()`
- `checkoutAPI.create()`
- `newsletterAPI.subscribe()`

### 5. `hooks.ts` — React Query hooks
- `useProducts()`, `useProduct(slug)`, `useRelatedProducts(slug)`, `useProductSearch(query)`
- `useCollections()`, `useCategories()`, `useCollectionProducts(slug)`
- `useCartQuery()`, `useAddToCart()`, `useUpdateCartItem()`, `useRemoveCartItem()`
- `useCreateCheckout()`, `useNewsletterSubscribe()`
- `sellqoKeys` query key factory

### 6. `CartContext.tsx` — Replace current CartContext
- Uses React Query cart hooks (no more local mock state)
- Cart ID in localStorage, auto-creates cart on first add
- Optimistic updates on quantity change / remove
- Error toasts
- Checkout → redirects to SellQo hosted checkout URL

## Phase 2: Update All Pages

### Homepage (`Index.tsx`)
- Replace `getProducts()`/`extractProducts()` imports → `useProducts()` hook + `extractArray` + `normalizeProducts`
- Replace `getCollections()` → `useCategories()` for category cards
- Newsletter → `useNewsletterSubscribe()` mutation

### Collection Page (`Collection.tsx`)
- Replace manual fetch → `useCollectionProducts(slug)` or `useProducts({ category_slug: slug })`
- Categories from `useCategories()` for pills/navigation

### Product Detail (`ProductDetail.tsx`)
- Replace manual fetch → `useProduct(slug)` + `useRelatedProducts(slug)`
- Variant selectors work with normalized `variant.options` (size/color)
- Add to cart → `useSellQoCart().addItem()` from new CartContext

### Search Overlay (`SearchOverlay.tsx`)
- Replace `searchProducts()` → `useProductSearch(query)` or direct `productsAPI.search()`

### Navbar (`Navbar.tsx`)
- Replace hardcoded `forHimLinks`/`forHerLinks` → `useCategories()` from API
- Cart badge → `useSellQoCart().itemCount`

### Cart Drawer + Cart Page
- Replace old `useCart()` → `useSellQoCart()` from new CartContext
- Real checkout flow with redirect

### App.tsx
- Replace `CartProvider` → `SellQoCartProvider`

## Phase 3: Cleanup
- Remove `src/lib/sellqo.ts` (old mock-based client)
- Remove `src/lib/mock-data.ts`
- Remove `src/contexts/CartContext.tsx` (replaced by sellqo CartContext)

## Files Created
- `src/integrations/sellqo/client.ts`
- `src/integrations/sellqo/types.ts`
- `src/integrations/sellqo/normalizer.ts`
- `src/integrations/sellqo/api.ts`
- `src/integrations/sellqo/hooks.ts`
- `src/integrations/sellqo/CartContext.tsx`

## Files Modified
- `src/App.tsx` — new CartProvider + remove old imports
- `src/pages/Index.tsx` — use hooks instead of manual fetches
- `src/pages/Collection.tsx` — use hooks
- `src/pages/ProductDetail.tsx` — use hooks + new cart
- `src/components/SearchOverlay.tsx` — use hooks
- `src/components/layout/Navbar.tsx` — dynamic categories + new cart
- `src/components/CartDrawer.tsx` — new cart context
- `src/pages/Cart.tsx` — new cart context
- `src/pages/CheckoutSuccess.tsx` — new cart clearCart

## Files Removed
- `src/lib/sellqo.ts`
- `src/lib/mock-data.ts`
- `src/contexts/CartContext.tsx`

## Key Difference from Loveke/Vanxcel
Those projects use a Supabase edge function proxy. Mancini connects **directly** to `https://sellqo.app/api/storefront` via POST. The API key (tenant_id) is public — it's a storefront ID, not a secret. No proxy needed.

