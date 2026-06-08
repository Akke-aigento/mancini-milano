# Role audit

## Cart-sync hardening
- `useCreateCart` idempotency-guard (localStorage + sessionStorage mirror + in-flight promise) to prevent duplicate empty carts within the same browser session.
- `Checkout` reconciliation when `initCheckout` returns fewer items than the local CartContext: create a fresh server cart, re-add every local item via `Promise.allSettled`, swap `mancini_cart_id`, mark old cart as orphaned (`mancini_orphaned_carts`) and re-init checkout.
- Fail-state (`checkoutBlocked`) with banner + "Pagina herladen" button + disabled "Doorgaan naar gegevens" CTA when reconciliation fails or the post-reconcile cart is still empty.

## Reconcile-flow normalisatie fix
- `Checkout.reconcileCart` now runs `cartAPI.create()` response through `extractSingle<Cart>() + normalizeCart()` (same pattern as `createCartIdempotent` in `hooks.ts`). Previously it read `.data.id` directly and received `undefined` because the SellQo storefront API returns `{ cart_id: <uuid> }`, causing the false-positive "cart_create returned no id" error and an empty checkout total.
- `cartAPI.addItem` responses are not normalised in the reconcile loop because only success/failure is consumed (`Promise.allSettled`); the authoritative cart state is re-fetched via the follow-up `initCheckout(newCartId)` call.
