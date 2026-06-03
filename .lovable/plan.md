# Classic site: producten renderen vanuit SellQo

## Probleem

`/classic/collections/:slug` en `/classic/products/:slug` zijn in `src/App.tsx` gerouteerd naar `ClassicPlaceholder`, dat alleen een statisch "Coming Soon"-blok toont. Daardoor verschijnt jouw gekoppelde product **Bold Luxe Sneakers** (en elke andere SellQo-koppeling onder `men-classic` / `classic-women`) niet op de Classic site, hoewel het FOR HIM / FOR HER-dropdown wél dynamisch laadt.

De Streetwear-kant gebruikt al `Collection.tsx` en `ProductDetail.tsx`, die SellQo via `useProducts` / `useProductBySlug` ophalen. Die logica werkt — we moeten hem alleen ook beschikbaar maken voor de Classic routes, met de juiste world-prefix en classic parent-roots.

## Aanpak

### 1. Routes omzetten
In `src/App.tsx`:
- `/classic/collections/:slug` → `<Collection />` (i.p.v. `ClassicPlaceholder kind="collection"`)
- `/classic/products/:slug` → `<ProductDetail />` (i.p.v. `ClassicPlaceholder kind="product"`)

`ClassicPlaceholder` blijft bestaan voor eventueel toekomstig gebruik, maar wordt niet meer als route gemount.

### 2. World-awareness in `Collection.tsx`
- `useWorld()` → `currentWorld`.
- Bepaal `basePath` = `/classic` of `/streetwear` en gebruik die voor álle interne links (subcategorie-tegels, pills).
- Bepaal parent-roots per world:
  - streetwear: `men`, `women` (huidige `MEN_SUBCATEGORIES` / `WOMEN_SUBCATEGORIES`).
  - classic: `men-classic`, `classic-women`. Subcategorieën **dynamisch** uit `useCategories()` resolven via `parent_id` (zelfde patroon als de pills-logica voor non-parent pages), zodat het overeenkomt met wat al in SellQo onder Classic > Men / Women is geconfigureerd. Geen hardcoded slug-lijst nodig voor Classic.
- SEO copy: voor Classic "Italian classics" i.p.v. "luxury streetwear".

### 3. World-awareness in `ProductDetail.tsx`
- `useWorld()` → bepaal `basePath`.
- Vervang alle `'/streetwear/...'` hardcoded links (breadcrumbs, "Continue shopping", canonical URL, related products) door `${basePath}/...`.
- Het product zelf wordt al via slug uit SellQo geladen, dus **Bold Luxe Sneakers** verschijnt direct op `/classic/products/bold-luxe-sneakers` zodra dit klaar is.

### 4. Classic look (minimale styling-aanpassing)
Beide pagina's gebruiken de gedeelde Layout en bestaande tokens. De Classic theming komt al via `data-world="classic"` op `<html>` (zie `WorldProvider`). We laten styling ongewijzigd buiten:
- Titels gebruiken al `font-heading`; op Classic mapt dit niet automatisch naar `font-classic`. Optioneel switchen we de h1's naar `font-classic` als `currentWorld === 'classic'`. **Vraag:** alleen routing fixen voor nu, of meteen ook de classic typografie (Playfair) toepassen op deze pagina's?

## Technische details

- `useCategories()` levert al alle categorieën (inclusief Classic children) — geen extra fetch nodig.
- Voor parent-detectie maken we een mapping:
  ```ts
  const PARENT_SLUGS = {
    streetwear: ['men', 'women'],
    classic: ['men-classic', 'classic-women'],
  };
  ```
- Subcategorie-cards op Classic parent pages: filter `categories` op `parent_id === parent.id`, gebruik `category.image` (uit SellQo) of fallback label.
- Titel display: bestaande regex die "women"-suffix strip wordt uitgebreid om ook "-classic" / "classic" suffix te strippen voor schonere koppen ("Men" i.p.v. "Men Classic").

## Wat verandert NIET

- SellQo-proxy en hooks.
- Navbar dropdowns (al dynamisch).
- Streetwear routes en gedrag.
- `ClassicHome` homepage.
