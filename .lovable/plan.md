Het probleem: de SellQo API geeft bij `category_slug=men-classic` alleen producten terug die rechtstreeks aan die parent hangen, niet aan child-categorieën. "The Boss Fragrance Tee" zit in `men-classic-accessories-bags`, dus die valt buiten de huidige query. Daarnaast bestaan er Classic takken die niet met `men-classic`/`classic-women` beginnen (`outerware-men-classic`, `outerware-women-classic` en hun children) — die worden door de world-filter foutief als niet-Classic gezien.

Plan:

1. **Descendant-aware fetching op Classic collectiepagina's** (`src/pages/Collection.tsx`)
   - Op elke Classic pagina (parent én sub) bouwen we uit de `useCategories()` boom de set van alle descendant-categorie-IDs/slugs van de gevraagde slug (inclusief de slug zelf).
   - In plaats van één `useProducts({ category_slug })` call, halen we producten op voor elke descendant-slug parallel (via `useQueries`) en mergen we het resultaat, ontdubbeld op product-id.
   - Streetwear blijft ongewijzigd: één enkele `useProducts({ category_slug })` call zoals nu.

2. **World-filter uitbreiden voor Classic outerware**
   - `isClassicCat` herkent ook `outerware-men-classic*` en `outerware-women-classic*` als Classic, zodat producten in die takken op Classic blijven en niet per ongeluk in streetwear lekken.

3. **Geen wijziging aan tegels of UI**
   - De parent-tegelpagina is al vervangen door de flat collection layout uit de vorige iteratie; die blijft. Enkel de productfetch wordt descendant-aware.

Technische notes:
- Helper `collectDescendantSlugs(categories, rootSlug)` doet een BFS vanaf het category-id met die slug en geeft alle descendant slugs terug (incl. root).
- We gebruiken `useQueries` van react-query zodat elke descendant-slug zijn eigen cache-key krijgt en we niet onnodig opnieuw fetchen.
- Loading state = elke onderliggende query nog loading. Resultaat = `flatMap` + `dedupe` op `product.id`.
- World-filter blijft als veiligheidsnet voor het geval een product in meerdere wereldcategorieën hangt.
