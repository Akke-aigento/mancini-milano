

# Homepage Secties Herstellen & Trending Categorie Fix

## 3 Wijzigingen

### 1. Trending Now — filter op categorie slug `trending`
Momenteel: `products.slice(0, 4)` (eerste 4 willekeurige producten).
Nieuw: gebruik `useProducts({ category_slug: 'trending' })` als aparte query zodat alleen producten uit de "trending" categorie getoond worden.

### 2. Shop the Look — sectie is er al
De "Shop the Look" sectie (Blue Storm Collection) staat al in de code (regels 231-280). Deze rendert alleen als `blueStormProducts.length > 0`. Als de sectie niet zichtbaar is, komt dat doordat de producten met slugs `blue-storm-luxe-tee` en `silent-authority` niet gevonden worden in de API response. De code blijft ongewijzigd — de sectie werkt al correct.

### 3. Exclusive/Fragrance — sectie is er al
De "Signature Fragrance" sectie (regels 282-313) staat al in de code. Rendert alleen als `fragrance` gevonden wordt (slug `mancini-milano-fragrance`). Ook deze code blijft ongewijzigd.

## Technische wijzigingen

### `src/pages/Index.tsx`
- Voeg een aparte `useProducts({ category_slug: 'trending' })` query toe voor trending producten
- Vervang `const trendingProducts = products.slice(0, 4)` door de data uit deze nieuwe query
- De rest van de code (Shop the Look + Fragrance) blijft intact — die secties bestaan al

### Eén file
- `src/pages/Index.tsx`

