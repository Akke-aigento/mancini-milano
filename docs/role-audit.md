# Role audit

## Cart-sync hardening
- `useCreateCart` idempotency-guard (localStorage + sessionStorage mirror + in-flight promise) to prevent duplicate empty carts within the same browser session.
- `Checkout` reconciliation when `initCheckout` returns fewer items than the local CartContext: create a fresh server cart, re-add every local item via `Promise.allSettled`, swap `mancini_cart_id`, mark old cart as orphaned (`mancini_orphaned_carts`) and re-init checkout.
- Fail-state (`checkoutBlocked`) with banner + "Pagina herladen" button + disabled "Doorgaan naar gegevens" CTA when reconciliation fails or the post-reconcile cart is still empty.

## Reconcile-flow normalisatie fix
- `Checkout.reconcileCart` now runs `cartAPI.create()` response through `extractSingle<Cart>() + normalizeCart()` (same pattern as `createCartIdempotent` in `hooks.ts`). Previously it read `.data.id` directly and received `undefined` because the SellQo storefront API returns `{ cart_id: <uuid> }`, causing the false-positive "cart_create returned no id" error and an empty checkout total.
- `cartAPI.addItem` responses are not normalised in the reconcile loop because only success/failure is consumed (`Promise.allSettled`); the authoritative cart state is re-fetched via the follow-up `initCheckout(newCartId)` call.

## Cart session_id stability fix
- New `getOrCreateSessionId()` helper in `src/integrations/sellqo/session.ts` mints a stable per-browser `mancini_session_id` (localStorage, in-memory fallback for strict privacy mode).
- `cartAPI.create()` now sends `session_id: getOrCreateSessionId()` instead of a fresh `crypto.randomUUID()` per call. Previously every call generated a new session_id, defeating the SellQo backend's idempotency filter (filter key = session_id) and producing 9 carts in 30 min for a single visitor (prod incident 2026-06-08).
- `Checkout.reconcileCart` now delegates cart creation to `createCartIdempotent` (re-exported from `hooks.ts`) so the in-flight guard prevents parallel creates inside the same paint cycle.
- `ensureSessionForLegacyCart()` runs once at app boot (`src/main.tsx`) — for visitors who already had a `mancini_cart_id` but no `mancini_session_id`, a session_id is minted now while the legacy cart_id is preserved so the reconcile-flow can still repair it.

## Rapid-refresh race fix
- `Checkout.tsx` now uses `initStarted` useRef as init-guard (StrictMode/re-entry safe) and `reconcileAttempted` useRef as mount-guard — at most one reconcile per Checkout page mount.
- Mismatch detection only runs AFTER a successful `initCheckout` resolve. If `initCheckout` throws, the page shows the error-banner via `setCheckoutBlocked(true)` and does NOT attempt reconcile (prevents creating a fresh cart on transient backend errors).
- After a successful init with items, `Checkout` writes the authoritative server cart into the react-query cache at `sellqoKeys.cart(cartId)` so `useSellQoCart()` / `CartContext` follows the server-state. This eliminates the "old + new items mix" after rapid-refresh + add-item.
- Diagnostic logging added in `createCartIdempotent` (timestamp + in-flight state + resulting cart_id) for future race diagnosis.
