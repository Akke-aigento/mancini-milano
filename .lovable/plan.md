

## Fix: Grijze placeholders overal vervangen

### Probleem
Op meerdere plekken verschijnen grijze vlakken (`bg-muted`, `bg-background`) als er geen afbeelding beschikbaar is. De gebruiker wil dit nergens meer zien.

### Locaties met grijze placeholders (buiten UI-componenten)

| # | Bestand | Waar | Wat |
|---|---------|------|-----|
| 1 | `Collection.tsx` r120 | Parent categorie-kaarten (men/women) | `bg-muted` fallback als `cat.image` leeg is |
| 2 | `Collection.tsx` r194 | Loading skeleton producten | `bg-background` blokken |
| 3 | `ProductDetail.tsx` r165-169 | Loading skeleton productpagina | `bg-background` blokken |
| 4 | `ProductCard.tsx` r30 | Product kaart wrapper | `bg-background` als geen afbeelding |
| 5 | `CartDrawer.tsx` r58 | Cart item afbeelding | `bg-background` container |
| 6 | `SearchOverlay.tsx` r92 | Zoekresultaten loading | `bg-card` blokken |

### Oplossing
- **Categorie-kaarten zonder afbeelding** (Collection.tsx): vervang de grijze `bg-muted` fallback door een stijlvolle donkere achtergrond (`bg-card` of `bg-foreground/5`) met subtiele styling passend bij het merk
- **Loading skeletons** (Collection.tsx, ProductDetail.tsx, SearchOverlay.tsx): gebruik `bg-card` of `bg-secondary/30` i.p.v. kale `bg-background` zodat ze subtiel zichtbaar zijn maar niet grijs opvallen
- **ProductCard & CartDrawer**: verander `bg-background` naar `bg-card` voor een meer geïntegreerde look

### Technisch detail
Alle wijzigingen zijn puur CSS-klasse aanpassingen — geen logica-wijzigingen. De `bg-muted` en kale `bg-background` worden vervangen door donkerdere, merk-passende kleuren die aansluiten bij het zwarte thema van de site.

### Bestanden
- `src/pages/Collection.tsx`
- `src/pages/ProductDetail.tsx`
- `src/components/ProductCard.tsx`
- `src/components/CartDrawer.tsx`
- `src/components/SearchOverlay.tsx`

