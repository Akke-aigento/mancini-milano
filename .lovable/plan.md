
## What I found

I checked Mancini against Vanxcel and Loveke.

Do I know what the issue is? Partly, yes.

- The current Mancini code already sends `session_id` on `cart_create`, so the earlier theory “it simply wasn’t being sent” is no longer enough.
- Vanxcel’s working version does **not** rely on a special persistent session system everywhere; it mainly:
  - sends a `session_id` when creating the cart,
  - keeps cart payloads minimal,
  - stores/reuses the cart ID consistently.
- The clearest bug I can confirm in Mancini right now is a **cart storage key mismatch**:
  - cart hooks store/read `mancini_cart_id`
  - checkout page reads `sellqo_cart_id`
  - so checkout can lose the active cart even when add-to-cart worked.
- I do **not** see proof that the whole proxy must be rewritten like Loveke. Mancini’s proxy style is closer to Vanxcel and should be kept, just hardened.

## Plan

### 1. Align cart/session handling with the working pattern
Update the cart client to follow Vanxcel’s safer approach:
- keep `session_id` on cart creation,
- add the same UUID fallback logic as Vanxcel (in case `crypto.randomUUID()` is unavailable),
- keep the request body minimal and predictable.

File:
- `src/integrations/sellqo/api.ts`

### 2. Use one single cart ID source everywhere
Remove the hardcoded checkout lookup for `sellqo_cart_id` and reuse the shared cart storage utility/key from the SellQo hooks.

This is likely why the flow breaks after cart actions.

Files:
- `src/pages/Checkout.tsx`
- `src/integrations/sellqo/hooks.ts` (reuse exported helpers instead of duplicating storage access)

### 3. Keep cart item payloads as strict as Vanxcel
Make sure add-to-cart only sends:
- `product_id`
- `quantity`
- `variant_id` only when present

This avoids noisy payloads and keeps the SellQo request identical to the working projects.

Files:
- `src/integrations/sellqo/api.ts`
- `src/pages/ProductDetail.tsx` (only if needed for guarding empty variant values)

### 4. Harden proxy error visibility instead of changing the architecture
Keep the current action-based proxy, but improve debugging output for cart actions so the next failing request clearly shows whether the problem is:
- `cart_create`
- `cart_add_item`
- malformed params returned by upstream

Files:
- `supabase/functions/sellqo-proxy/index.ts`

### 5. Recheck the checkout flow after cart fix
Once cart creation/reuse is stable:
- confirm checkout reads the same cart ID,
- confirm shipping/payment/order placement use that active cart correctly,
- keep the new multi-step checkout flow intact.

Files:
- `src/pages/Checkout.tsx`
- `src/pages/Cart.tsx`
- `src/components/CartDrawer.tsx` (only if any cart navigation assumptions need cleanup)

## Technical details

### Confirmed mismatch
- `src/integrations/sellqo/hooks.ts` uses `mancini_cart_id`
- `src/pages/Checkout.tsx` reads `sellqo_cart_id`

That alone is a guaranteed bug.

### Files to update
- `src/integrations/sellqo/api.ts`
- `src/integrations/sellqo/hooks.ts`
- `src/pages/Checkout.tsx`
- `supabase/functions/sellqo-proxy/index.ts`
- possibly `src/pages/ProductDetail.tsx`

### What I would not change
- No database changes
- No auth changes
- No full proxy rewrite
- No “inject session_id into every request” unless logs prove SellQo actually requires that

## Expected outcome

After this implementation:
- cart creation should follow the same safe pattern as Vanxcel,
- the active cart ID will be reused consistently,
- checkout will no longer lose the cart because of the wrong localStorage key,
- if a SellQo cart error still remains, the proxy logs will point to the exact failing action instead of guessing.
