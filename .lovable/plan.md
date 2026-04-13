
## Fix: productkaart springt van juiste hoofdfoto naar andere foto

### Waarschijnlijke oorzaak
Dit lijkt geen probleem met de ingestelde hoofdfoto in SellQo zelf, maar met de frontend-weergave van `ProductCard`.

Wat ik in de code zie:
- De SellQo response voor `the-boss-fragrance-tee` geeft de juiste `featured_image`
- De normalizer zet die ook al op `images[0]`
- Maar `src/components/ProductCard.tsx` toont op hover automatisch `images[1]`

Daardoor krijg je precies dit gedrag:
1. eerst laadt de juiste hoofdfoto
2. daarna, zodra de kaart in hover-state staat, fade/springt de card naar de tweede afbeelding

Omdat jij op de collectiepagina zit, is dat de meest logische verklaring voor het “verpringen”.

### Fix
Ik zou dit oplossen in `src/components/ProductCard.tsx`:

1. Een uitzondering toevoegen voor `the-boss-fragrance-tee`
   - voor dit product géén hover-image gebruiken
   - altijd de hoofdfoto (`images[0]`) tonen

2. De bestaande hover-swap laten staan voor andere producten
   - zodat de rest van de shop hetzelfde blijft werken

### Waarom dit de juiste plek is
- De data uit SellQo lijkt al correct binnen te komen
- De fout ontstaat pas in de UI-laag
- `ProductCard` wordt gebruikt op collectiepagina’s en related products, dus één fix pakt alles tegelijk mee

### Concrete implementatie
In `src/components/ProductCard.tsx`:
- bereken iets zoals:
  - `const allowHoverImage = hasSecondImage && product.slug !== 'the-boss-fragrance-tee';`
- gebruik `allowHoverImage` i.p.v. `hasSecondImage`:
  - voor de fade-out class van de eerste image
  - voor het renderen van de tweede image

### Resultaat na de fix
- “The Boss Fragrance Tee” blijft stabiel op de juiste hoofdfoto staan
- geen visuele sprong meer op de collectiekaart
- andere producten behouden hun huidige hover-effect

### Bestand om aan te passen
1. `src/components/ProductCard.tsx`
