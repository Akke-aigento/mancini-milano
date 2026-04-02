

# Fix Fragrance Slug

## Probleem
De "Exclusive" sectie zoekt naar slug `mancini-milano-fragrance`, maar de correcte slug is `mancini-milano`.

## Wijziging

### `src/pages/Index.tsx`
- Verander `p.slug === 'mancini-milano-fragrance'` naar `p.slug === 'mancini-milano'`

### Eén file
- `src/pages/Index.tsx`

