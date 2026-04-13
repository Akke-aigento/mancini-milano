

## Fix: Two mobile/tablet bugs on product pages

### Bug 1 — Size selector dismisses immediately on tap

**Current behavior:** Tapping a size in the floating footer size selector immediately closes the selector AND adds to cart in one action. The user never sees which size they picked.

**Desired behavior:** Tapping a size highlights it and keeps the selector open. The main button text changes to "Add to Cart – M" (or whichever size). The user then taps that button to confirm.

**Fix in `src/pages/ProductDetail.tsx` (lines 417-425):**
- Remove `setShowSizeSelector(false)` and `handleAddToCart(size)` from the size button's onClick
- Only call `setSelectedSize(size)` so the size highlights and the button updates
- The existing main button (line 447-468) already handles the rest: once `selectedSize` is set, it shows "Add to Cart – M" and calls `handleAddToCart()` on tap

```typescript
// Size button onClick becomes:
onClick={() => {
  if (isSizeOOS) return;
  setSelectedSize(size);
  // Selector stays open, user confirms via the main button below
}}
```

The main button (line 447) already works correctly: when `needsSize && !selectedSize` it shows "Select Size" and opens the selector; when `selectedSize` is set it shows "Add to Cart – {size}" and calls `handleAddToCart()`. So the flow becomes: open selector → tap size → size highlights → tap "Add to Cart – M" → adds to cart and closes selector.

Additionally, close the size selector after successful add-to-cart by adding `setShowSizeSelector(false)` inside the main button's click handler (after `handleAddToCart()`).

### Bug 2 — "Back to Top" button overlaps floating footer

**Current behavior:** The BackToTop button is fixed at `bottom-6 right-6` with `z-40`, sitting on top of the product page's floating footer (`z-30`). It's unnecessary and obstructive on product pages that already have the sticky footer.

**Fix in `src/components/BackToTop.tsx`:**
- Accept an optional `hidden` prop or use route detection
- Simplest approach: use `useLocation()` to detect if we're on a product detail page (`/products/*`) and return `null`
- Alternative: raise the button position when on a product page — but hiding is cleaner since the floating footer already scrolls back to the product info area

```typescript
import { useLocation } from 'react-router-dom';

const BackToTop = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  // Hide on product pages where the floating footer is shown
  const isProductPage = pathname.startsWith('/products/');

  useEffect(() => { /* existing scroll listener */ }, []);

  if (!visible || isProductPage) return null;
  // ... rest unchanged
};
```

### Files to edit
1. `src/pages/ProductDetail.tsx` — size selector onClick behavior
2. `src/components/BackToTop.tsx` — hide on product pages

