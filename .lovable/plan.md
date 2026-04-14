

## Plan: Categoriestructuur vereenvoudigen met directe slugs

### Wat verandert
De `?gender=men/women` intersectie-filter is niet meer nodig. Elke subcategorie heeft nu een unieke slug in de API, dus we kunnen direct op slug fetchen.

### Wijzigingen

**1. `src/pages/Collection.tsx`**
- Verwijder de dubbele fetch + intersectie-logica (primaryProducts / subcategoryProducts)
- Gebruik gewoon één `useProducts({ category_slug: slug })` call
- Op parent-pagina's (`men`/`women`): toon subcategorie-kaarten met de juiste slugs
- Introduceer twee aparte lijsten: `MEN_SUBCATEGORIES` en `WOMEN_SUBCATEGORIES` met de correcte slugs
- Verwijder de `?gender=` query parameter logica volledig

**2. `src/components/layout/Navbar.tsx`**
- `forHimLinks`: slugs blijven `jackets`, `hoodies`, etc.
- `forHerLinks`: slugs worden `jackets-women`, `hoodies-women`, etc.
- Verwijder `linkPrefix` / `?gender=` uit de dropdown-links — directe slug-links volstaan

**3. `src/pages/Index.tsx`**
- Homepage categorie-links: verwijder `?gender=men` — link direct naar de slug (bijv. `/collections/jackets`)

**4. `src/components/layout/Footer.tsx`**
- Controleer of footer-links nog correct zijn (For Him → `/collections/men`, For Her → `/collections/women`)

### Technisch detail

```text
Oud:  /collections/hoodies?gender=men   → 2 API calls + intersectie
Nieuw: /collections/hoodies             → 1 API call (heren)
       /collections/hoodies-women       → 1 API call (dames)
```

Subcategorie-mapping:
```text
MEN:   jackets, hoodies, t-shirts, pants, tracksuits, bags, accessories
WOMEN: jackets-women, hoodies-women, t-shirts-women, pants-women, tracksuits-women, bags-women, accessories-women
```

### Resultaat
- Simpelere code, één fetch per pagina
- Geen gender-filter query params meer nodig
- Navbar "For Her" linkt direct naar de juiste women-slugs
- Parent-pagina's tonen de correcte subcategorie-kaarten per gender

