
## Fix: alle grijze image frames zwart of transparant maken

### Wat ik nu zie
Je screenshot toont dat het probleem niet meer enkel placeholders zijn. De grijze vlakken zitten vooral in **image containers zelf**: producten met transparante of vrijstaande packshots staan op een `bg-card` container, en die 5% grijs zie je als padding rond de afbeelding.

### Root cause
Deze containers gebruiken nog steeds een donkere fill:
- `src/components/ProductCard.tsx` — product grid kaarten (`bg-card` + `object-contain`)
- `src/pages/ProductDetail.tsx` — hoofdafbeelding (`bg-background` + `object-contain`)
- Ook gelijkaardige mini-afbeeldingen in:
  - `src/components/CartDrawer.tsx`
  - `src/components/SearchOverlay.tsx`
  - `src/pages/Cart.tsx`
  - `src/pages/Checkout.tsx`
  - `src/pages/CheckoutAddress.tsx`

### Aanpak
Ik zou dit gestructureerd in 2 lagen oplossen:

1. **Product/media containers zonder foto-achtergrond**
- vervang `bg-card` / `bg-background` door `bg-transparent`
- behoud eventueel enkel `overflow-hidden`
- waar nodig subtiele `border border-border` alleen als kader, niet als fill

2. **Per component juiste beeld-fit behouden**
- productkaarten en productdetail met `object-contain` mogen geen grijze fill meer hebben
- mini-thumbnails in cart/search/checkout ook naar transparant of zwart zonder card-fill
- hover overlays nakijken zodat daar ook geen grijze wash meer verschijnt

### Bestanden om aan te passen
- `src/components/ProductCard.tsx`
- `src/pages/ProductDetail.tsx`
- `src/components/CartDrawer.tsx`
- `src/components/SearchOverlay.tsx`
- `src/pages/Cart.tsx`
- `src/pages/Checkout.tsx`
- `src/pages/CheckoutAddress.tsx`

### Concrete wijziging
Per bestand:
- image wrapper `bg-card` of `bg-background` verwijderen
- waar nodig vervangen door:
  - `bg-transparent`
  - of helemaal geen background class
  - optioneel `border border-border` als visuele aflijning gewenst is
- hover overlay in `ProductCard` verfijnen zodat die niet opnieuw als grijze padding leest

### Verwacht resultaat
- geen grijze padding meer rond productafbeeldingen
- transparante PNG’s vallen proper weg tegen de zwarte site
- overal consistente zwarte/transparante image frames, ook buiten de collectiepagina

### Technisch detail
Belangrijkste bron nu:
```tsx
<div className="relative aspect-[3/4] overflow-hidden mb-3 bg-card">
```
Die `bg-card` moet weg op alle plaatsen waar het image zelf niet full-bleed vult of transparantie bevat.

### Extra opmerking
Op basis van je screenshot lijkt `/collections/jackets` momenteel de duidelijkste plek waar dit nog zichtbaar is, dus daar zou ik de cleanup eerst op richten en daarna dezelfde pattern sitebreed doortrekken.
