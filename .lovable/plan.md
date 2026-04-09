

# Fix: Verwijder "For Him" / "For Her" uit collectie-titels

## Probleem
Bij subcategorieën zoals T-Shirts toont de pagina "T-Shirts — For Him". De klant wil alleen "T-Shirts" zien.

## Oplossing — `src/pages/Collection.tsx` (regel 46-47)

Verwijder de gender-suffix uit de titel. De `genderLabel` variabele en de samenvoeging worden weggehaald:

```typescript
// Was:
const genderLabel = genderFilter === 'men' ? 'For Him' : genderFilter === 'women' ? 'For Her' : '';
const title = genderLabel ? `${baseTitle} — ${genderLabel}` : baseTitle;

// Wordt:
const title = baseTitle;
```

Eén bestand, twee regels.

