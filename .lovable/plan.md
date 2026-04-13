
## Fix: Sort sizes in logical order (S → M → L → XL)

### Problem
Sizes are displayed in whatever order the API returns them. A `Set` preserves insertion order, so if the backend returns variants in a random order, sizes appear jumbled (e.g. L, S, XL, M).

### Solution
Add a size sorting map in `ProductDetail.tsx` and sort the sizes array after extracting from the Set.

### Changes — `src/pages/ProductDetail.tsx`

In the `sizes` useMemo (lines 49-61), after `Array.from(s)`, sort using a predefined order map:

```typescript
const SIZE_ORDER: Record<string, number> = {
  'xxs': 0, 'xs': 1, 's': 2, 'm': 3, 'l': 4, 'xl': 5,
  'xxl': 6, '2xl': 6, 'xxxl': 7, '3xl': 7,
};

// In the useMemo:
const sorted = Array.from(s).sort((a, b) => {
  const aOrder = SIZE_ORDER[a.toLowerCase()] ?? 99;
  const bOrder = SIZE_ORDER[b.toLowerCase()] ?? 99;
  return aOrder - bOrder;
});
return { items: sorted, label: detectedKey };
```

This covers standard clothing sizes. Numeric sizes (e.g. 38, 40, 42) naturally sort correctly via the fallback `?? 99` since they won't match the map — but if numeric sizes are also used, we can add a numeric parse fallback in the comparator.

### Also check: SizeGuide.tsx
The size guide page already has sizes hardcoded in S → XL order, so no change needed there.
