

## Fix: Newsletter subscribe button overflows viewport in footer

### Problem
The newsletter form in the footer uses `flex` with `flex-1` on the input and a fixed-width button. On smaller screens or the 4-column footer layout, the parent column is narrow enough that the button text "SUBSCRIBE" (with `px-4` padding and uppercase tracking) pushes beyond the container edge.

### Fix — `src/components/layout/Footer.tsx`

**Line 85**: Change the form from `flex` (single row) to a stacked layout so the input and button each take full width of the column:

```html
<!-- BEFORE -->
<form ... className="flex">

<!-- AFTER -->
<form ... className="flex flex-col gap-2">
```

**Line 92**: Remove `flex-1` from the input (no longer needed when stacked) and add `w-full`:

```
className="w-full bg-background border border-border px-3 py-2 text-sm ..."
```

**Line 97**: Add `w-full` to the button so it spans the column width:

```
className="w-full border border-foreground ... px-4 py-2 text-xs uppercase ..."
```

This ensures the newsletter form never overflows regardless of column width. The stacked layout also looks cleaner in the footer's 4-column grid.

### Files to edit
1. `src/components/layout/Footer.tsx` — 3 small class changes on lines 85, 92, 97

