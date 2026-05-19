## Doel

De S/C-initialen in de world-switch vervangen door twee herkenbare, op-maat getekende iconen: een **stropdas** voor Classic en een **sneaker** voor Streetwear. Het pictogram doet meteen het werk dat tekst nu doet — universeel leesbaar, ook op klein scherm.

## Aanpak

Lucide heeft geen stropdas of sneaker, dus ik teken twee kleine inline-SVG componenten in dezelfde lijnstijl als de rest van de iconen (1.25–1.5 stroke, `currentColor`, 16–18px). Geen extra dependency.

### 1. Nieuw bestand: `src/components/icons/WorldIcons.tsx`

Bevat twee minimalistische SVG-componenten:

- **`TieIcon`** — silhouette van een stropdas: smalle knoop bovenin, driehoekige punt eronder. Strakke lijnen, geen vulling, in de classic-gold kleur via `currentColor`.
- **`SneakerIcon`** — zijaanzicht van een lage sneaker: zool-lijn onderin, vetersilhouet bovenin, één accentstreep. Past bij de stoere streetwear-toon.

Beide nemen `className` en `strokeWidth` als props zodat ze schalen met het pill-formaat.

### 2. `WorldSwitch.tsx` aanpassen

- Importeer de twee icon-componenten.
- Vervang het `display`-veld door:
  - `variant === 'mobile'` → alleen icoon (18px), pill iets breder voor optische balans.
  - `variant === 'desktop'` → icoon (14px) + label naast elkaar in elke knop.
  - `variant === 'full'` (mobiel menu paneel) → icoon (16px) + label gecentreerd.
- Active-state geeft het icoon dezelfde tekstkleur als de label (goud-op-zwart of accent-op-licht), inactive-state inherit `currentColor` van de muted text.

### 3. Mobiele pill-breedte bijstellen

De mini-pill (variant `mobile`) groeit van ~48px naar ~56px (2× 28px segment) om de iconen ademruimte te geven zonder de gecentreerde logo te raken bij 320px viewports. Hoogte blijft 32px.

### 4. ARIA & toegankelijkheid

- Iconen krijgen `aria-hidden`.
- De knop houdt zijn `aria-label="Switch to Classic / Streetwear"` zodat screen-readers en toetsenbordgebruikers exact weten waar ze klikken — de iconografie staat hier alleen voor visuele communicatie.

## Visueel

```text
DESKTOP NAVBAR (icoon + label)
[ 👟 STREETWEAR │ 👔 CLASSIC ]

MOBIEL NAVBAR (alleen icoon, ~56×32)
[ 👟 │ 👔 ]

MOBIEL MENU PANEEL (full-width)
[   👟 STREETWEAR    │    👔 CLASSIC   ]
```

Echte iconen worden custom getekend in dezelfde dunne stroke-stijl als Lucide — geen emoji.

## Niet aanpassen

- Geen wijzigingen aan `WorldContext`, `Layout.tsx`, of de plaatsing van de switch in de navbar (dat is al goed).
- Geen kleurtokens veranderen.
- Streetwear/Classic-pagina's blijven identiek.