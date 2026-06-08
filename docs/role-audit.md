# Role audit

## Cart-sync hardening
- `useCreateCart` idempotency-guard (localStorage + sessionStorage mirror + in-flight promise) to prevent duplicate empty carts within the same browser session.
- `Checkout` reconciliation when `initCheckout` returns fewer items than the local CartContext: create a fresh server cart, re-add every local item via `Promise.allSettled`, swap `mancini_cart_id`, mark old cart as orphaned (`mancini_orphaned_carts`) and re-init checkout.
- Fail-state (`checkoutBlocked`) with banner + "Pagina herladen" button + disabled "Doorgaan naar gegevens" CTA when reconciliation fails or the post-reconcile cart is still empty.
