

## Probleem
Op de productpagina staan bij een sold out product **twee** "SOLD OUT" elementen direct boven elkaar in de hoofdcontent (zie screenshots desktop + mobile):

1. **Regel 334-338 in `src/pages/ProductDetail.tsx`** — een aparte info-badge die alleen bij `isOutOfStock` getoond wordt:
   ```tsx
   {isOutOfStock && (
     <div className="mb-4 border border-border bg-card px-4 py-3 text-center">
       <span>Sold Out</span>
     </div>
   )}
   ```

2. **Regel 342-364** — de Add to Cart knop, die zijn label vervangt door "Sold Out" wanneer het product niet op voorraad is.

Beide zien er visueel identiek uit (border + bg-card + zelfde tekststijl) → vandaar het dubbel-effect.

## Oplossing
De redundante info-badge (regel 334-338) **volledig verwijderen**. De disabled knop daaronder communiceert al duidelijk dat het product uitverkocht is, en is consistent met de rest van de UI flow.

De `isLowStock` waarschuwing (regel 339-341) blijft staan, want die geeft andere informatie.

### Wijziging
**`src/pages/ProductDetail.tsx`** — regels 334-338 verwijderen.

### Resultaat
- Sold out producten: **1x** SOLD OUT label (de disabled knop)
- In stock producten: ongewijzigd
- Layout blijft schoon, zowel mobile als desktop

