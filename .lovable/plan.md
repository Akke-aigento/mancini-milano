

# Fix: Categorie Afbeeldingen Laden Niet

## Probleem
De screenshot toont dat de categorie-afbeeldingen broken zijn — alleen alt-text ("T-shirts", "Jackets", "Hoodies") is zichtbaar. 

De `useCategories()` hook haalt categorieën op maar past **geen normalisatie** toe. De data wordt raw als `Category` getypt. Het `image` veld op de `Category` interface verwacht een string, maar de SellQo API stuurt het waarschijnlijk als `image_url` (net zoals bij collections, waar de normalizer `raw.image_url || raw.image` doet).

## Oplossing
Voeg een `normalizeCategory` functie toe in de normalizer die `image_url` correct mapt, en gebruik deze in de `useCategories` hook.

## Wijzigingen

### 1. `src/integrations/sellqo/normalizer.ts`
Nieuwe functie toevoegen:
```tsx
export function normalizeCategory(raw: any): Category {
  return {
    id: raw.id,
    slug: raw.slug || '',
    name: raw.name || raw.title || '',
    description: raw.description || undefined,
    image: raw.image_url || raw.image || undefined,
    product_count: raw.product_count ?? undefined,
    parent_id: raw.parent_id || undefined,
    position: raw.position ?? 0,
  };
}

export function normalizeCategories(rawCategories: any[]): Category[] {
  return (rawCategories || []).map(normalizeCategory);
}
```

### 2. `src/integrations/sellqo/hooks.ts`
- Import `normalizeCategories`
- In `useCategories()`, na `extractArray` de data normaliseren:
```tsx
const raw = extractArray<any>(res);
return normalizeCategories(raw);
```

### Twee files
- `src/integrations/sellqo/normalizer.ts`
- `src/integrations/sellqo/hooks.ts`

