## Wijziging

Vervang de 4 placeholder gradient-blokken in de "THE COLLECTION" sectie op `/classic` (`src/pages/classic/ClassicHome.tsx`) door echte productfoto's uit de uploads.

### Mapping
- **Tops** → `user-uploads://image-78.png` (Mancini t-shirt)
- **Outerwear** → `user-uploads://Screenshot_2026-05-20_at_14.39.43.png` (gewatteerd vest)
- **Bottoms** → `user-uploads://Screenshot_2026-05-20_at_14.38.45.png` (zwarte jeans)
- **Accessories** → `user-uploads://Screenshot_2026-05-20_at_14.39.54.png` (schoudertas)

### Stappen
1. Kopieer de 4 uploads naar `src/assets/`:
   - `classic-cat-tops.jpg`
   - `classic-cat-outerwear.jpg`
   - `classic-cat-bottoms.jpg`
   - `classic-cat-accessories.jpg`
2. Importeer ze bovenaan `ClassicHome.tsx`.
3. Vervang in de "Secondary category strip" de gradient-divs door een `<img>` met `object-cover` over de volledige `aspect-[4/5]` tegel.
4. Behoud de bestaande hover (gold border-tint overlay), de label eronder met gold underline-animatie, en de slug-links.
5. Verwijder de `gradient` en de grote letter-overlay (niet meer nodig met echte foto's).

### Niet aanpassen
- For Him / For Her primaire tegels
- Streetwear
- Layout, spacing, kopjes, of andere secties op Classic
