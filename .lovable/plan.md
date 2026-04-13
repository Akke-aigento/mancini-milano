

## Bug: Cart badge count not updating after QR/bank transfer payment

### Root cause

Two issues in `clearCart()` in `CartContext.tsx`:

1. **Wrong query key**: `clearCart` calls `queryClient.setQueryData(['cart'], undefined)` but the actual cart query key is `sellqoKeys.cart(cartId)` = `['sellqo', 'cart', '<cart-id>']`. The `setQueryData` call does nothing because the key doesn't match.

2. **Non-reactive cartId**: `useCartQuery` reads `cartId` from localStorage at hook initialization (`const cartId = getStoredCartId()`). Even after `localStorage.removeItem(CART_STORAGE_KEY)`, the hook still has the old `cartId` cached and the query stays `enabled: true` with stale data. `invalidateQueries` then re-fetches the old cart (which may still exist on the backend), restoring the stale item count.

The result: localStorage is cleared, but the React Query cache still holds the old cart data, so `itemCount` stays > 0 until a full page refresh.

### Fix — `src/integrations/sellqo/CartContext.tsx`

Replace `clearCart` with a version that:
1. Reads the current cartId from localStorage **before** removing it
2. Uses the correct query key (`sellqoKeys.cart(cartId)`) to clear cached data
3. Removes **all** cart-related queries from the cache instead of invalidating (which would re-fetch)

```typescript
const clearCart = useCallback(() => {
  const cartId = getStoredCartId();
  try { localStorage.removeItem(CART_STORAGE_KEY); } catch { /* noop */ }
  // Clear with correct query key
  if (cartId) {
    queryClient.setQueryData(sellqoKeys.cart(cartId), undefined);
  }
  // Remove all cart queries from cache entirely (don't invalidate = don't re-fetch)
  queryClient.removeQueries({ queryKey: ['sellqo', 'cart'] });
}, [queryClient]);
```

This requires importing `getStoredCartId` and `sellqoKeys` (already available in the module).

### Result
After QR/bank transfer payment, the cart badge in the navbar immediately shows 0 (no badge) without needing a page refresh.

