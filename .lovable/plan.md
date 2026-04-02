

# Exclusive Sectie: Afbeelding Tussen Tekst en Prijs

## Wat
Op mobiel staat de afbeelding nu helemaal onderaan (in de tweede grid-kolom). Door de layout te herstructureren komt de afbeelding tussen de beschrijvingstekst en de prijs — logischer en visueel mooier.

## Wijziging

### `src/pages/Index.tsx` (regels 286-309)

Op mobiel: alles in één flow (geen 2-kolom grid). Volgorde wordt:
1. "Exclusive" label + titel + beschrijving
2. Afbeelding (gecentreerd)
3. Prijs + CTA knop

Op desktop (`lg:`): behoud de huidige 2-kolom layout met tekst links en afbeelding rechts.

**Aanpak:** Verplaats de afbeelding `<div>` naar binnen de tekstkolom, tussen de beschrijving en de prijs. Op `lg:` wordt de afbeelding via `lg:hidden` verborgen in de tekstkolom en blijft de aparte rechterkolom met `hidden lg:flex` behouden.

```tsx
<div className="text-center lg:text-left">
  <span>Exclusive</span>
  <h2>The Signature Fragrance</h2>
  <p>A fragrance for men who...</p>
  
  {/* Afbeelding — alleen op mobiel hier getoond */}
  <div className="flex justify-center my-8 lg:hidden">
    <div className="w-56">
      <img ... />
    </div>
  </div>
  
  <p>From €75.95</p>
  <Link>Discover →</Link>
</div>

{/* Afbeelding — alleen op desktop */}
<div className="hidden lg:flex justify-center">
  <div className="w-80">
    <img ... />
  </div>
</div>
```

### Eén file
- `src/pages/Index.tsx`

