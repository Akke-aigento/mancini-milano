

# Shop the Look — Dynamisch via Categorie `shop-the-look`

## Wat verandert

De hardcoded product slugs (`blue-storm-luxe-tee`, `silent-authority`) worden vervangen door een dynamische query op de categorie `shop-the-look`. Zo kan de klant via SellQo zelf bepalen welke producten in deze sectie verschijnen.

## Wijzigingen in `src/pages/Index.tsx`

### 1. Data fetching (regels 26-27)
- Verwijder `useProduct('blue-storm-luxe-tee')` en `useProduct('silent-authority')`
- Voeg toe: `const { data: shopTheLookProducts = [] } = useProducts({ category_slug: 'shop-the-look' });`

### 2. Verwijder `blueStormProducts` array (regel 44)
- Niet meer nodig — gebruik direct `shopTheLookProducts`

### 3. Sectie "Shop the Look" (regels 228-275)
- Vervang `blueStormProducts.length > 0` door `shopTheLookProducts.length > 0`
- Vervang `blueStormProducts.map(...)` door `shopTheLookProducts.map(...)`
- Gebruik het eerste product's image als de grote lifestyle-foto (links), in plaats van de hardcoded URL
- Toon de overige producten als lijst (rechts)
- Vervang de hardcoded titel "Blue Storm Collection" door de categorie-naam (uit `categories` data) of een generieke "Shop the Look"
- Update de "Shop Collection →" link van `/collections/t-shirts` naar `/collections/shop-the-look`

### Eén file

