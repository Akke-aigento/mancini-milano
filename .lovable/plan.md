

# Shop the Look: Gebruik categorie-afbeelding (modelfoto)

## Probleem
De grote afbeelding in de "Shop the Look" sectie toont nu het eerste product (`shopTheLookProducts[0].images[0].url`), maar de modelfoto staat als categorie-afbeelding op SellQo.

## Oplossing — `src/pages/Index.tsx` (regels 231-238)

Vervang de product-afbeelding door de categorie-afbeelding:

```typescript
// Van:
{shopTheLookProducts[0]?.images?.[0] && (
  <img src={shopTheLookProducts[0].images[0].url} ... />
)}

// Naar:
const shopTheLookCategory = categories.find((c: any) => c.slug === 'shop-the-look');
// In de JSX:
{(shopTheLookCategory?.image || shopTheLookProducts[0]?.images?.[0]?.url) && (
  <img
    src={shopTheLookCategory?.image || shopTheLookProducts[0].images[0].url}
    alt={shopTheLookCategory?.name || 'Shop the Look'}
    className="w-full h-full object-cover"
  />
)}
```

De categorie-afbeelding heeft prioriteit; als die ontbreekt valt het terug op het eerste product. Eén bestand, drie regels.

