

# Fix: Vaste Subcategorieën + Volgorde voor "For Him" en "For Her"

## Probleem
De subcategorieën worden dynamisch opgebouwd uit productdata. Hierdoor ontbreekt "Jackets" soms, en de volgorde is niet consistent. De klant wil een vaste lijst en volgorde, ook als er geen producten achter zitten.

## Oplossing — `src/components/layout/Navbar.tsx`

Vervang de dynamische `forHimLinks` en `forHerLinks` useMemo's door een **hardcoded vaste lijst** met de gewenste volgorde:

```
Jackets → Hoodies → T-Shirts → Pants → Tracksuits → Accessories
```

Beide genders krijgen exact dezelfde subcategorieën in dezelfde volgorde. De links worden altijd getoond, ongeacht of er producten achter zitten.

### Concrete wijziging (regels 104-135)

Vervang de `ALLOWED_GENDER_SLUGS` constante en beide `useMemo` blokken door:

```typescript
const FIXED_SUBCATEGORIES = [
  { label: 'Jackets', slug: 'jackets' },
  { label: 'Hoodies', slug: 'hoodies' },
  { label: 'T-Shirts', slug: 't-shirts' },
  { label: 'Pants', slug: 'pants' },
  { label: 'Tracksuits', slug: 'tracksuits' },
  { label: 'Accessories', slug: 'accessories' },
];

const forHimLinks = FIXED_SUBCATEGORIES;
const forHerLinks = FIXED_SUBCATEGORIES;
```

Daarnaast: verwijder de conditionele rendering die "For Him"/"For Her" verbergt als er geen producten zijn (regels 187-193 en 285-291). Beide menu-items worden altijd getoond.

## Eén bestand

| Bestand | Wijziging |
|---|---|
| `src/components/layout/Navbar.tsx` | Vaste subcategorieën, vaste volgorde, altijd zichtbaar |

