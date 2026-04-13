

## Fix: Preserve checkout state on page refresh

### Problem
When refreshing any checkout page (`/checkout`, `/checkout/address`, `/checkout/payment`), shipping cost drops to €0 because:

1. **Checkout.tsx & CheckoutAddress.tsx** guard on `cartItems.length === 0` — on refresh, React cart state is empty, so they redirect to `/cart` instead of re-fetching from the backend
2. **Checkout.tsx** always auto-selects the first shipping method after `initCheckout`, potentially overwriting a previously selected method
3. The backend already returns the correct shipping_cost via `buildCartResponse()` — the frontend just needs to use it

### Fix

**File: `src/pages/Checkout.tsx`** (useEffect, lines 21-48)
- Remove the `cartItems.length === 0` guard — don't redirect based on React state
- Only redirect if no `cart_id` in localStorage
- After `initCheckout`, only auto-select shipping if the response does NOT already have a shipping method set (i.e. `shipping_cost` is null/undefined)

**File: `src/pages/CheckoutAddress.tsx`** (useEffect, lines 34-43)
- Remove the `cartItems.length === 0` guard
- Only redirect if no `cart_id` in localStorage
- Keep the existing `if (!checkoutData) initCheckout(cartId)` logic — this is correct

**File: `src/pages/CheckoutPayment.tsx`** — no changes needed, already handles refresh correctly

### Technical detail

The key insight: on refresh, `cartItems` (from React Query/context) is empty, but `mancini_cart_id` in localStorage is still valid. The backend's `checkout_start` returns the full cart state including shipping. The frontend should trust the backend response rather than checking local React state.

For the auto-shipping in Checkout.tsx, the check changes from "always select first" to "only select if backend response shows no shipping selected yet" (check `data.shipping_cost == null`).

### Files to edit
1. `src/pages/Checkout.tsx` — remove cartItems guard, conditional auto-shipping
2. `src/pages/CheckoutAddress.tsx` — remove cartItems guard

