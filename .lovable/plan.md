

## Fix: Product page overflow on smaller desktop screens

### Problem
At the `lg` breakpoint (1024px), the product detail grid uses `lg:grid-cols-[55%_45%]` with `lg:gap-12` (3rem). The percentages + gap exceed 100% of the container width, causing the right column (size buttons, "SIZE GUIDE" link, "SELECT A SIZE" button) to extend beyond the viewport edge.

### Root cause
`55% + 45% + 3rem gap = 100% + 3rem` → overflow. The `overflow-x: hidden` on body hides the scrollbar but clips the content.

### Fix — `src/pages/ProductDetail.tsx`

**Line 217** — Change the grid template to use `fr` units instead of percentages. `fr` units respect the gap automatically:

```typescript
// BEFORE:
<div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-12">

// AFTER:
<div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12">
```

This gives the image column ~55% and the info column ~45% of the *available* space (after the gap is subtracted), preventing any overflow.

Also apply the same fix to the **loading skeleton grid** on **line 154**:
```typescript
// BEFORE:
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

// AFTER (match the product grid ratio):
<div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12">
```

### Additional: add `min-w-0` to right column
On line 258, add `min-w-0` to the info column to prevent any child (like long product titles or buttons) from forcing the column wider than its grid track:

```typescript
// BEFORE:
<div className="lg:sticky lg:top-32 lg:self-start">

// AFTER:
<div className="lg:sticky lg:top-32 lg:self-start min-w-0">
```

### Result
Content stays within viewport at all desktop widths (1024px and up). No visual change at larger screens.

