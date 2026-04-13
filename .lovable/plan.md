

## Fix: Allow re-selecting color and size in floating footer

### Problem
Once color and size are selected, tapping the main button goes straight to "Add to Cart". There's no way to change your selection — the color/size selector panels can't be reopened.

### Fix — `src/pages/ProductDetail.tsx`

**Show selected color/size as tappable chips** between the selectors and the bottom bar (around line 469). Tapping a chip reopens that selector.

**Changes to the bottom bar area (line 469-511):**

Add a row of selected-option chips above the action button area:

```tsx
{/* Selected options — tap to change */}
{(selectedColor || selectedSize) && !showColorSelector && !showSizeSelector && (
  <div className="flex gap-2 px-4 pt-3 bg-card border-t border-border">
    {selectedColor && needsColor && (
      <button onClick={() => { setShowColorSelector(true); setShowSizeSelector(false); }}
        className="text-xs uppercase tracking-button border border-foreground px-3 py-1.5">
        {colorLabel}: {selectedColor} ✎
      </button>
    )}
    {selectedSize && needsSize && (
      <button onClick={() => { setShowSizeSelector(true); setShowColorSelector(false); }}
        className="text-xs uppercase tracking-button border border-foreground px-3 py-1.5">
        {sizeLabel}: {selectedSize} ✎
      </button>
    )}
  </div>
)}
```

This row appears only when at least one option is selected and neither selector panel is open. Tapping a chip opens the corresponding selector so the user can change their choice.

The existing color/size selector panels and button logic remain unchanged — they already handle re-selection correctly (tapping a different option updates the state).

### Files to edit
1. `src/pages/ProductDetail.tsx` — add tappable selection chips row before the action bar

