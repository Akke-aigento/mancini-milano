

## Volledige analyse: hoofdfoto-probleem

### Het werkelijke gedrag van de SellQo API

Ik heb de raw API response onderzocht voor meerdere producten. De API geeft per product **twee velden** terug:

- `featured_image` (string) — de hoofdfoto die je in SellQo hebt aangeduid
- `images` (array) — alle foto's, **al gesorteerd met de featured image op positie 0**

Bevestigd met live data:

| Product | `featured_image` | `images[0]` | Overeenkomst? |
|---|---|---|---|
| Get Money Hoodie | `1776403146993-nq2ib8.png` | `1776403146993-nq2ib8.png` | ✅ Match |
| The Boss Fragrance Tee | `background-editor_output_4606c21c...png` | `background-editor_output_4606c21c...png` | ✅ Match |
| No Face | `rn-image_picker_lib_temp_d2eb0f7b...png` | `rn-image_picker_lib_temp_d2eb0f7b...png` | ✅ Match |

**Conclusie #1:** SellQo doet zijn werk goed. De hoofdfoto staat altijd al op index 0 van de array.

---

### Waarom het op de site tóch fout gaat

#### Probleem A — Hardcoded product overrides in `normalizer.ts`

In `src/integrations/sellqo/normalizer.ts` (regel 40-45) zit een handmatige override:

```ts
if ((raw.slug === 'no-face' || raw.handle === 'no-face') && images.length > 1) {
  const [back, front, ...rest] = images;
  images.length = 0;
  images.push(front, back, ...rest);  // SWAPT positie 0 en 1
}
```

Dit verwisselt actief de eerste twee foto's voor `no-face`. Maar SellQo levert deze al correct! Resultaat: de **verkeerde** foto wordt nu als hoofdfoto getoond. Als de klant ooit in SellQo de hoofdfoto verandert, blijft deze hardcoded swap actief en is het altijd fout.

#### Probleem B — Onnodig complexe "featured-image-prioritering" logica

In `normalizer.ts` (regel 27-37) zit code die probeert de `featured_image` te vinden in de array en die naar voren te schuiven. Dit is bedoeld als veiligheid, maar:

- Het werkt alleen op `===` URL-match. Wanneer SellQo dezelfde foto zou serveren via een andere CDN-variant of querystring, faalt de match → `findIndex` geeft `-1` → de featured image wordt als **extra** image toegevoegd op positie 0, met als gevolg een dubbele foto en een verkeerde hover-image (de "echte" eerste foto schuift naar positie 1 = hover slot).

- Het is ook simpelweg overbodig: SellQo levert images al gesorteerd.

#### Probleem C — Hardcoded ProductCard exception

In `src/components/ProductCard.tsx` (regel 26):

```ts
const allowHoverImage = hasSecondImage && product.slug !== 'the-boss-fragrance-tee';
```

Eén specifiek product heeft hover-swap uitgeschakeld via een hardcoded slug-check. Dit lost een symptoom op (verkeerde 2e foto), niet de oorzaak. Voor elk nieuw product dat hetzelfde probleem vertoont moet dit handmatig uitgebreid worden — niet schaalbaar.

#### Probleem D — De hover-image is altijd `images[1]`, ongeacht of dat zinvol is

In `ProductCard.tsx` toont de hover de tweede foto. Maar als SellQo's volgorde verstoord wordt (zoals bij `no-face` door Probleem A, of bij Probleem B's findIndex-mismatch), is `images[1]` de echte hoofdfoto die dan als "hover-flip" verschijnt. Dat verklaart probleem 2 van de klant: "een foto achter zit die zichtbaar wordt bij hover".

---

### Diagnose samengevat

```text
SellQo API levert correcte volgorde
        │
        ▼
normalizer.ts ──► hardcoded no-face swap  ──► volgorde stuk
        │
        └────► featured-image findIndex   ──► soms duplicate image
        │
        ▼
ProductCard ──► hardcoded boss-tee exception ──► pleister op symptoom
        │
        ▼
Hover swap toont images[1] = vaak de echte hoofdfoto
```

Het fundamentele patroon: **er is wantrouwen jegens de API ingebouwd via overrides**, en die overrides veroorzaken juist de bugs.

---

### Voorgestelde oplossing (toekomstbestendig)

1. **`normalizer.ts` opschonen**
   - Verwijder de `no-face` hardcoded swap volledig
   - Vereenvoudig de image-normalisatie: vertrouw op `images` zoals geleverd door SellQo. Gebruik `featured_image` enkel als `images` leeg is (echte fallback)
   - Geen `findIndex` / `unshift` logica meer

2. **`ProductCard.tsx` opschonen**
   - Verwijder de hardcoded `the-boss-fragrance-tee` exception
   - Hover-image regel: toon `images[1]` als die bestaat, punt. Als de klant in SellQo een andere foto wil als "hover preview", upload hij die als 2e image — dat is exact hoe het nu al werkt aan SellQo-zijde.

3. **`mem://ux/product-card/visual-overrides` verwijderen**
   - De memory-regel die hover-disabling per slug aanmoedigt is achterhaald. Vervangen door één regel: "Vertrouw SellQo image-volgorde; geen hardcoded product overrides".

### Resultaat

- Hoofdfoto in SellQo = hoofdfoto op site (overal: collectie, productpagina, cart, gerelateerde producten)
- Hover-preview is altijd de 2e foto in SellQo — voorspelbaar voor de klant
- Werkt automatisch voor alle huidige én toekomstige producten zonder code changes
- Geen visuele "ghost foto" die opduikt bij hover

### Validatie na implementatie

- Spot-check 5 producten (incl. `no-face` en `the-boss-fragrance-tee`): hoofdfoto matcht SellQo
- Hover-test: 2e foto verschijnt clean, geen flicker van een 3e "verborgen" foto
- Klant kan in SellQo de hoofdfoto van een product wijzigen → na refresh meteen zichtbaar op de site

