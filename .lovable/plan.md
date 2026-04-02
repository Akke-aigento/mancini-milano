

# Fix: Producten Renderen Niet Onder Gender Categorieën

## Probleem
Wanneer je via "For Him" → "Bags" navigeert (URL: `/collections/bags?gender=men`), worden producten gefetcht met `category_slug=bags`. Vervolgens filtert de client op producten die ook `men` in hun `categories` array hebben. Maar de API geeft waarschijnlijk niet alle categorieën per product terug bij een gefilterde query — dus de client-side filter verwijdert alles.

## Oplossing
Draai de logica om wanneer een `gender` param aanwezig is:
- **Fetch** producten met `category_slug={gender}` (bijv. `men`)
- **Filter client-side** op producten die ook de subcategorie (bijv. `bags`) in hun `categories` array hebben

Dit werkt omdat de `men`-query al bewezen werkt (de navbar bouwt er de dropdown mee op).

## Wijziging

### `src/pages/Collection.tsx` (regel 16-26)

**Van:**
```tsx
const { data: allProducts = [], isLoading: loading } = useProducts(slug ? { category_slug: slug } : undefined);

const genderFilteredProducts = useMemo(() => {
  if (!genderFilter) return allProducts;
  return allProducts.filter(p =>
    p.categories?.some(c => c.slug === genderFilter)
  );
}, [allProducts, genderFilter]);
```

**Naar:**
```tsx
// When gender filter is active, fetch from gender category and filter by subcategory client-side
const fetchSlug = genderFilter || slug;
const { data: allProducts = [], isLoading: loading } = useProducts(fetchSlug ? { category_slug: fetchSlug } : undefined);

const genderFilteredProducts = useMemo(() => {
  if (!genderFilter || !slug) return allProducts;
  // We fetched by gender (men/women), now filter for the subcategory
  return allProducts.filter(p =>
    p.categories?.some(c => c.slug === slug)
  );
}, [allProducts, genderFilter, slug]);
```

### Eén file
- `src/pages/Collection.tsx`

