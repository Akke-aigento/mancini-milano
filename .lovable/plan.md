

## Fix: Change "View Cart" to "Continue Shopping" in cart drawer

### Problem
The cart drawer shows a "View Cart" link at the bottom, but the user is already viewing the cart contents. This is confusing — it should say "Continue Shopping" and close the drawer so the user can keep browsing.

### Fix — `src/components/CartDrawer.tsx`

**Line 127-132**: Change the link destination and text:
- Text: `View Cart` → `Continue Shopping`  
- Instead of navigating to `/cart`, simply close the drawer (the user stays on the current page)
- Change `<Link to="/cart">` to a `<button>` that calls `closeCart()`

### Files to edit
1. `src/components/CartDrawer.tsx` — one small change on lines 126-132

