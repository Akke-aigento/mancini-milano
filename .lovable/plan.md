

## Fix: Productkaart achtergrondkleur matchen met pagina

### Probleem
Nu `object-contain` wordt gebruikt, is de ruimte rond de afbeelding zichtbaar. Die ruimte heeft kleur `bg-card` (5% grijs) terwijl de pagina-achtergrond 0% zwart is.

### Oplossing
In `src/components/ProductCard.tsx`: verander `bg-card` naar `bg-background` op de image container div.

### Bestand
1. `src/components/ProductCard.tsx` — regel met `aspect-[3/4]`: `bg-card` → `bg-background`

