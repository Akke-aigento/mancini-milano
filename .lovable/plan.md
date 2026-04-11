

# Fix: No Face hoodie — voorkant tonen op collectiepagina

## Probleem
De "No Face" hoodie toont de achterkant als hoofdafbeelding op de collectiepagina. De SellQo config werkt niet mee om dit via de backend te fixen.

## Oplossing
Een simpele slug-based override in de normalizer die voor het product "no-face" de afbeeldingsvolgorde omdraait, zodat de voorkant (met het model / front design) als eerste wordt getoond.

## Aanpak

**Bestand: `src/integrations/sellqo/normalizer.ts`**

Na de bestaande featured_image logica (regel 37), een override toevoegen:

```typescript
// Override: No Face hoodie — toon voorkant als hoofdafbeelding
if ((raw.slug === 'no-face' || raw.handle === 'no-face') && images.length > 1) {
  // Zoek de afbeelding met het model (voorkant) — typisch index 1
  // Swap eerste twee afbeeldingen
  const [back, front, ...rest] = images;
  images.length = 0;
  images.push(front, back, ...rest);
}
```

Dit is een minimale, gerichte fix. Zodra de SellQo config later werkt, kan dit blok simpelweg verwijderd worden.

## Bestanden
| Bestand | Wijziging |
|---|---|
| `src/integrations/sellqo/normalizer.ts` | Slug-based image swap voor "no-face" |

