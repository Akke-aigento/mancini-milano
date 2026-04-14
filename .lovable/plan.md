

## Fix: hover-image uitzetten voor Blue Storm op t-shirts pagina

### Probleem
Wanneer `preferredImageIndex` wordt meegegeven, wordt de "originele" afbeelding (index 0, modelfoto) nog steeds als hover-image gerenderd. Die is weliswaar `opacity-0`, maar is zichtbaar in de DOM en kan er doorheen schemeren.

### Oplossing
In `ProductCard.tsx`: als `preferredImageIndex` is meegegeven (dus niet `undefined`), schakel het hover-effect uit — net als bij de Boss Fragrance Tee.

### Wijziging — `src/components/ProductCard.tsx`

Regel 28 aanpassen:
```typescript
// Was:
const allowHoverImage = hasSecondImage && product.slug !== 'the-boss-fragrance-tee';

// Wordt:
const allowHoverImage = hasSecondImage && product.slug !== 'the-boss-fragrance-tee' && preferredImageIndex == null;
```

Dat is alles — één conditie toevoegen. Wanneer een `preferredImageIndex` is meegegeven, geen hover-swap, alleen de subtiele scale-105 zoom.

### Bestand
1. `src/components/ProductCard.tsx` (1 regel)

