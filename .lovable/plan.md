

## Dynamische "Coming Soon" voor vrouwencategorieën

### Probleem
De "Coming Soon" pagina voor vrouwen is hardcoded — ongeacht of er producten in de categorie staan. Nu er producten worden toegevoegd, moet de pagina automatisch "vrijschakelen" zodra er producten zijn.

### Aanpak
Verwijder de hardcoded Coming Soon check (`slug === 'women' || genderFilter === 'women'`) en maak het datagedreven:

1. **Fetch women's products** — ook wanneer `slug === 'women'` (parent page), zodat we weten of er producten zijn
2. **Parent page `/collections/women`**: toon het categorie-grid (net als bij `/collections/men`), maar filter subcategorieën die 0 producten hebben in combinatie met "women" — die tonen "Coming Soon" inline
3. **Subcategorie met `?gender=women`**: de bestaande intersectie-logica werkt al correct. Als `genderFilteredProducts.length === 0` na laden, toon dan "Coming Soon". Als er producten zijn, toon het normale productgrid.

### Concrete wijzigingen — `src/pages/Collection.tsx`

**1. Products fetchen voor women parent page**
Wijzig de `useProducts` call zodat deze ook voor `women` (parent) producten ophaalt:
```typescript
const { data: primaryProducts = [], isLoading: primaryLoading } = useProducts(
  primarySlug ? { category_slug: primarySlug } : undefined
);
```
(Verwijder de `!isParent &&` guard)

**2. Verwijder hardcoded Coming Soon block**
Verwijder regels 96-110 volledig (de `if (slug === 'women' || genderFilter === 'women')` check).

**3. Parent page: filter lege subcategorieën**
Op de parent page (`/collections/women`), gebruik de opgehaalde `primaryProducts` om te bepalen welke subcategorieën producten bevatten. Subcategorieën zonder producten in de vrouwencollectie krijgen een "Coming Soon" overlay of worden grijs weergegeven.

**4. Subcategorie: fallback bij 0 producten**
De bestaande "No products found" tekst in het productgrid (regel 218-220) vervangen door een nettere "Coming Soon" melding wanneer `genderFilter === 'women'` en er geen producten zijn. Voor andere collecties blijft "No products found" staan.

### Resultaat
- Categorie met producten + vrouw → normaal productgrid
- Categorie zonder producten + vrouw → "Coming Soon"
- Volledig automatisch: zodra een product aan bijv. "T-Shirts" + "Women" wordt gekoppeld, verschijnt die categorie direct

### Bestand
1. `src/pages/Collection.tsx`

