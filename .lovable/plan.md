

# Out-of-stock meldingen toevoegen

## Probleem
Als een product of variant uitverkocht is, krijgt de gebruiker geen duidelijke melding. De knoppen werken gewoon niet, zonder uitleg waarom.

## Oplossing
Op 3 plekken duidelijke, stijlvolle out-of-stock meldingen toevoegen:

## Wijzigingen

| Bestand | Wat |
|---|---|
| `src/pages/ProductDetail.tsx` | 1. **Product-niveau**: als `product.in_stock === false`, toon een "Sold Out" badge en disable de Add to Cart knop met tekst "Sold Out" |
| | 2. **Variant-niveau**: als de geselecteerde variant `stock_status === 'out_of_stock'` is, disable de Add to Cart knop met "Sold Out" tekst |
| | 3. **Maatknoppen**: individuele maten die uitverkocht zijn visueel doorstrepen (line-through + lagere opacity) en niet selecteerbaar maken |
| | 4. **Mobiele footer**: dezelfde "Sold Out" status tonen in de sticky footer |
| `src/components/ProductCard.tsx` | "Sold Out" badge overlay tonen op productkaarten als `in_stock === false` of `stock_status === 'out_of_stock'` |

### Visueel
- **Sold Out badge**: klein label linksboven op de productafbeelding (zwart/wit, uppercase, tracking)
- **Uitverkochte maten**: doorgestreepte tekst + verlaagde opacity, niet klikbaar
- **Add to Cart knop**: disabled state met "Sold Out" tekst in gedempte kleur
- **Low stock**: optioneel een subtiel "Low Stock" label tonen als `stock_status === 'low_stock'`

### Technisch
- `ProductCard` interface uitbreiden met optionele `in_stock` en `stock_status` props
- Per variant de `stock_status` checken voor de maatknoppen
- `selectedVariant?.stock_status` gebruiken om de Add to Cart knop state te bepalen

