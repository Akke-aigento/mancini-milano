## Doel
Op mobiel de splash/frontpage tonen als 2×2 vierkant grid (zoals desktop), i.p.v. de huidige verticaal gestapelde volle-hoogte tegels.

## Wijziging
Eén bestand: `src/pages/Splash.tsx`

- `<main>` grid: van `grid-cols-1 sm:grid-cols-2` → **`grid-cols-2`** (altijd 2 kolommen, ook op mobiel).
- Tegels: `min-h-[45vh]` op mobiel is te groot voor een echt vierkant → vervangen door **`aspect-square`** op mobiel en `sm:aspect-auto sm:min-h-[50vh]` op groter, zodat desktop-gedrag hetzelfde blijft.
- Borders herzien voor een net 2×2 raster op alle breakpoints: rechterrand op oneven tegels, onderrand op de bovenste rij.
- Typografie schaalt mee: labels iets kleiner op mobiel (bv. `text-2xl sm:text-4xl lg:text-6xl`) en "Discover More" chip verkleinen zodat het in een vierkant tegel goed leesbaar blijft; padding terug naar `pb-5 sm:pb-10`.
- Header (Mancini / Milano) blijft ongewijzigd.

## Wat blijft hetzelfde
- 4 werelden, afbeeldingen, routes, alt-teksten, hover/scale-animatie, gradient-overlay, SEO.
- Desktop layout blijft visueel identiek.

## Verificatie
- Mobiel (375px & 414px): 2×2 vierkanten, geen horizontal scroll, tekst leesbaar en gecentreerd.
- Tablet (sm ≥640px) en desktop: ongewijzigd t.o.v. huidige versie.
