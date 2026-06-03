# Classic ↔ Streetwear scheiding fixen

## Probleem

Twee samenhangende issues zorgen ervoor dat Classic-pagina's streetwear-producten tonen:

1. **Verkeerde slugs in ClassicHome.tsx** — de tegels linken naar slugs die in SellQo niet bestaan onder Classic:
   - "For Him" → `/classic/collections/men` (= streetwear parent)
   - "For Her" → `/classic/collections/women` (= streetwear parent)
   - Categorie-tegels → `outerware`, `tops`, `bottoms`, `accessories` (bestaan helemaal niet)

2. **SellQo storefront-API fallback** — als `category_slug` niet bestaat, geeft de API gewoon álle producten (26 streetwear items) i.p.v. een lege lijst. Dat is hun gedrag en kunnen we niet wijzigen vanuit de frontend.

De echte Classic slugs in SellQo zijn `men-classic`, `classic-women`, en diepere kinderen zoals `men-classic-tops`, `men-classic-tops-long-sleeves`, `classic-women-bottoms-jeans`, etc.

## Aanpak

### 1. `ClassicHome.tsx` — dynamische, échte Classic slugs

- Vervang hardcoded slugs door waardes uit `useCategories()`:
  - "For Him" tegel → `men-classic`
  - "For Her" tegel → `classic-women`
- Voor de 4 categorie-tegels (Outerwear / Tops / Bottoms / Accessories): resolve dynamisch op naam (case-insensitive) onder de kinderen van `men-classic`. Voorbeeld: tegel "Tops" zoekt eerste child van `men-classic` met name die `tops` bevat → slug `men-classic-tops`. Image blijft het lokale asset.
- Als een naam-match niet gevonden wordt: tegel rendert nog steeds maar link gaat naar `men-classic` (parent) zodat de gebruiker nooit op een SellQo-fallback URL belandt.

### 2. `Collection.tsx` — defensief world-filter (vangnet)

Onafhankelijk van slug-correctheid: bij `currentWorld === 'classic'` filter de opgehaalde producten zodat alleen items met `category.slug` die start met `classic`, `men-classic`, of `classic-women` getoond worden. Symmetrisch voor streetwear: filter classic-categorieën uit.

Reden: zelfs als iemand handmatig een verkeerde URL invoert of een toekomstig tile een typo krijgt, lekt SellQo's "fallback = alles" niet door naar de verkeerde wereld.

Implementatie:
```ts
const isClassicCat = (slug?: string) =>
  !!slug && (slug === 'classic' || slug.startsWith('men-classic') || slug.startsWith('classic-women'));

const visible = sortedProducts.filter(p =>
  world === 'classic' ? isClassicCat(p.category?.slug) : !isClassicCat(p.category?.slug)
);
```

### 3. Empty state

Als `visible.length === 0` na filtering, toon huidige "Coming Soon" copy (al aanwezig). Telling onder de titel gebruikt `visible.length` i.p.v. `products.length`.

## Wat verandert NIET

- SellQo proxy / edge function — alleen frontend.
- Navbar dropdowns — al dynamisch via `parent_id` van `men-classic` / `classic-women`, dus correct.
- Streetwear pagina's blijven identiek (filter is symmetrisch en classic-categorieën zitten momenteel niet in streetwear parent → geen merkbare verandering, alleen vangnet).
- `ClassicPlaceholder` — niet meer gebruikt sinds vorige loop.

## Acceptance

- `/classic/collections/men-classic` toont alléén producten waarvan `category.slug` begint met `men-classic` of `classic`.
- Klik op een Classic homepage-tegel landt op een **bestaande** SellQo-slug, niet op een fallback.
- Streetwear pagina's tonen ongewijzigde inhoud.
- Nieuwe Classic-categorie in SellQo onder `men-classic` of `classic-women` verschijnt vanzelf in Navbar-dropdown (al werkend) en — indien de naam matcht — in de ClassicHome-tegels.
