

# All Solid Buttons → Outlined Style (Like "Shop Men")

## What Changes

Every solid black button (`bg-primary text-primary-foreground`) gets replaced with the outlined style: `border border-foreground text-foreground hover:bg-foreground hover:text-background`.

## Files & Locations

### 1. `src/pages/Index.tsx`
- **Line 82** (mobile "Shop Women"): `bg-primary text-primary-foreground … hover:bg-gold-hover` → `border border-foreground text-foreground hover:bg-foreground hover:text-background`
- **Line 115** (desktop "Shop Women"): same swap

### 2. `src/pages/Cart.tsx`
- **Line 26** ("Continue Shopping" link): same swap
- **Line 124** ("Checkout" button): same swap

### 3. `src/pages/CheckoutSuccess.tsx`
- **Line 31** ("Continue Shopping"): same swap

### 4. `src/pages/Checkout.tsx`
- **Lines 272, 324, 371, 462** (address submit, shipping submit, review order, place order buttons): same swap

### 5. `src/pages/ProductDetail.tsx`
- **Line 106** ("Back to Home"): same swap
- **Lines 259, 332** (Add to Cart enabled state): `bg-primary text-primary-foreground hover:bg-gold-hover` → `border border-foreground text-foreground hover:bg-foreground hover:text-background`

### 6. `src/components/CartDrawer.tsx`
- Any solid primary buttons: same swap

### 7. `src/components/ui/button.tsx`
- Update the `default` variant from `bg-primary text-primary-foreground hover:bg-primary/90` to `border border-foreground text-foreground bg-transparent hover:bg-foreground hover:text-background` — this catches any `<Button>` usage site-wide

## What stays the same
- Destructive/logout buttons keep their red styling
- Disabled states keep their muted styling
- Step indicators in checkout keep their circle styling

## Result
All action buttons across the site will have the consistent outlined look: black border, no fill, hover inverts to solid black with white text.

