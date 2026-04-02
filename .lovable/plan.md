

# Fix SellQo API — Add Proxy + Switch to RESTful Endpoints

## Problem
All API calls fail with "Failed to fetch". The current client calls `https://sellqo.app/api/storefront` directly via POST with `action` parameters, but this endpoint either doesn't exist or blocks CORS from browsers. The working reference projects (Loveke, Vanxcel) both use a **Supabase Edge Function proxy** that forwards requests to the real SellQo API at `https://gczmfcabnoofnmfpzeop.supabase.co/functions/v1/storefront-api` using **RESTful GET/POST endpoints** (not POST-based actions).

## Solution
1. Connect Supabase (Lovable Cloud) to this project
2. Create a `sellqo-proxy` edge function (identical pattern to Loveke/Vanxcel)
3. Rewrite the client to use GET-based RESTful endpoints through the proxy
4. Rewrite the API module to match the RESTful endpoint structure

## Changes

### Step 1: Connect Supabase
Prompt the Lovable Cloud / Supabase connection so we get a project URL for the proxy.

### Step 2: Create `supabase/functions/sellqo-proxy/index.ts`
Edge function that proxies all requests to the real SellQo storefront API, adding the API key server-side and handling CORS.

### Step 3: Rewrite `src/integrations/sellqo/client.ts`
- Change base URL from direct `https://sellqo.app/api/storefront` to `${SUPABASE_URL}/functions/v1/sellqo-proxy`
- Switch from single-POST-with-action to standard `fetch(url, options)` passthrough
- Keep `extractArray` and `extractSingle` as-is
- Add `X-Tenant-ID` header with tenant ID `2606c5b9-caf8-4a42-94cd-80e3f3f31988`

### Step 4: Rewrite `src/integrations/sellqo/api.ts`
Switch from POST actions to RESTful endpoints matching the real API:
- `get_products` → `GET /products?category_slug=...`
- `get_product` → `GET /products/{slug}`
- `get_related_products` → `GET /products/{slug}/related`
- `search_products` → `GET /products/search?q=...`
- `get_collections` → `GET /collections`
- `get_categories` → `GET /categories`
- `create_cart` → `POST /cart`
- `get_cart` → `GET /cart/{id}`
- `add_to_cart` → `POST /cart/{id}/items`
- `update_cart_item` → `PUT /cart/{id}/items/{itemId}`
- `remove_cart_item` → `DELETE /cart/{id}/items/{itemId}`
- `create_checkout` → `POST /checkout`
- `subscribe_newsletter` → `POST /newsletter/subscribe`

### Step 5: Store SELLQO_API_KEY as Supabase secret
The API key needs to be set as an environment secret in the Supabase project so the proxy can authenticate.

### Files changed
- `supabase/functions/sellqo-proxy/index.ts` (new)
- `src/integrations/sellqo/client.ts` (rewrite)
- `src/integrations/sellqo/api.ts` (rewrite)

### Files unchanged
- `src/integrations/sellqo/hooks.ts` — no changes needed, hooks call the API module
- `src/integrations/sellqo/normalizer.ts` — no changes needed
- `src/integrations/sellqo/types.ts` — no changes needed
- All page/component files — no changes needed

