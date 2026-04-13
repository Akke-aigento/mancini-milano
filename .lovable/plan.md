

## Fix: Variant sizes not rendering for "The Midnight Jacket" (and similar products)

### Root Cause

The SellQo backend returns variant attribute keys that are set by the store owner. For "The Midnight Jacket", the attribute key is `"Sized"` instead of `"Size"`. After lowercasing in the normalizer, this becomes `"sized"`, which does NOT match any entry in `SIZE_KEYS = ['size', 'maat', 'taille', 'größe']`.

This means `sizes` is empty, `needsSize` is false, and no size selector is rendered — even though the product has 4 size variants (S, M, L, XL).

### Affected Products

From checking the API, only **The Midnight Jacket** currently has this issue (`"Sized"` instead of `"Size"`). Other products with variants (Urban Luxury, Inferno Luxe, Classic T-Shirt, etc.) use `"Size"` and `"Color"` which match correctly.

However, more products could be affected in the future if the store owner uses non-standard option names.

### Fix — `src/pages/ProductDetail.tsx`

Make the key matching more resilient by using `startsWith` instead of exact matching, and add common variations:

**Line 10-11**: Update `SIZE_KEYS` and `COLOR_KEYS` to also match partial/fuzzy keys:

```typescript
const SIZE_KEYS = ['size', 'sized', 'maat', 'taille', 'größe'];
const COLOR_KEYS = ['color', 'colour', 'kleur', 'couleur', 'farbe'];
```

Additionally, update `getOptionValue` (lines 13-19) to also try `startsWith` matching as a fallback, so keys like `"sizes"`, `"sizing"` etc. would also work:

```typescript
const getOptionValue = (options: Record<string, string> | undefined, keys: string[]): { value: string; key: string } | null => {
  if (!options) return null;
  // Exact match first
  for (const k of keys) {
    if (k in options) return { value: options[k], key: k };
  }
  // Fallback: startsWith match
  for (const k of keys) {
    for (const optKey of Object.keys(options)) {
      if (optKey.startsWith(k) || k.startsWith(optKey)) {
        return { value: options[optKey], key: optKey };
      }
    }
  }
  return null;
};
```

### Files to edit
1. `src/pages/ProductDetail.tsx` — add `'sized'` to SIZE_KEYS and make `getOptionValue` more resilient

