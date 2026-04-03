

# For Him / For Her: Alleen Specifieke Categorieën Tonen

## Wat verandert

De dropdowns tonen nu alle categorieën die op producten staan. We filteren dit zodat alleen deze 6 categorieën getoond worden:
- T-shirts, Pants, Tracksuits, Hoodies, Jackets, Accessories

## Wijziging in `src/components/layout/Navbar.tsx`

### Regels 104-129 — `forHimLinks` en `forHerLinks` useMemo's

Voeg een whitelist toe en filter de catMap resultaten:

```typescript
const ALLOWED_GENDER_SLUGS = ['t-shirts', 'pants', 'tracksuits', 'hoodies', 'jackets', 'accessories'];
```

In beide useMemo's, na het opbouwen van de catMap, filter op deze slugs:

```typescript
return Array.from(catMap.values())
  .filter(c => ALLOWED_GENDER_SLUGS.includes(c.slug))
  .sort((a, b) => a.position - b.position);
```

### Eén file, twee locaties (forHimLinks + forHerLinks)

