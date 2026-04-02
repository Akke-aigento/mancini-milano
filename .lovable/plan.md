

# Homepage Categorie Afbeeldingen: API Images Gebruiken

## Probleem
De 3 categorie-afbeeldingen op de homepage zijn hardcoded in een `categoryImages` object (regels 13-17). De `Category` interface heeft al een `image?` veld — we moeten dit gebruiken.

## Wijzigingen

### `src/pages/Index.tsx`

1. **Verwijder** het `categoryImages` object (regels 13-17)

2. **Update `featuredCategories`** (regels 39-46) om het `image` veld mee te nemen vanuit de API:
```tsx
const featuredCategories = featuredCategorySlugs.map((slug) => {
  const apiCat = categories.find((c: any) => c.slug === slug);
  return {
    id: apiCat?.id || slug,
    name: apiCat?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    slug,
    image: apiCat?.image || '',
  };
});
```

3. **Update de `<img>` tag** in de categorie grid (rond regel 145) van `categoryImages[cat.slug]` naar `cat.image`:
```tsx
<img src={cat.image} alt={cat.name} ... />
```

Als een categorie geen afbeelding heeft in SellQo, wordt er simpelweg geen afbeelding getoond (lege string). Zodra je in SellQo een afbeelding toevoegt aan de categorie, verschijnt deze automatisch.

### Eén file
- `src/pages/Index.tsx`

