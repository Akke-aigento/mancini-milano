

## Fix: Add color selector to mobile floating footer

### Problem
The floating footer on mobile/tablet only shows a size selector. Products with color options (like this t-shirt) require a color to be selected before adding to cart, but there's no way to pick a color in the floating footer. The main "Select Size" button also doesn't account for needing a color.

### Fix — `src/pages/ProductDetail.tsx`

**Add a color selector panel** above the size selector in the floating footer (around line 406):

1. Add a `showColorSelector` state variable
2. When `needsColor && !selectedColor`, tapping the main button opens the color selector first
3. After picking a color, if `needsSize`, open the size selector next
4. The flow becomes: tap button → pick color → pick size → tap "Add to Cart – M"

**Floating footer structure (lines 405-470):**

```
<div fixed bottom-0>
  {showColorSelector && needsColor && (
    <div> <!-- color buttons, same style as size selector --> </div>
  )}
  {showSizeSelector && needsSize && (
    <div> <!-- existing size buttons --> </div>
  )}
  <div> <!-- bottom bar with title, price, action button --> </div>
</div>
```

**Main button logic update (line 447-454):**
- If `needsColor && !selectedColor` → open color selector
- Else if `needsSize && !selectedSize` → open size selector  
- Else → add to cart and close selectors

**Button text update (line 466):**
- Show "Select Color" when color is needed but not selected
- Show "Select Size" when size is needed but not selected
- Show `Add to Cart – ${selectedColor} / ${selectedSize}` when both are set

### Files to edit
1. `src/pages/ProductDetail.tsx` — add color selector panel + update button logic in floating footer

