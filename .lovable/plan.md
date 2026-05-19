## Doel

De geüploade campagnefoto wordt de nieuwe hero op `/classic`, maar de heading, body en CTA-knop worden **door ons in code gerenderd** als overlay — niet ingebakken in de afbeelding. Zo blijven tekst, vertaling, knoplink en typografie volledig editable en passen ze bij het design system (`font-classic`, `text-classic-gold`, etc.).

## Probleem met de aangeleverde afbeelding

De upload heeft de tekst **"TIMELESS STYLE. MADE TO LAST."** + body + "SHOP COLLECTION"-knop **al ingebakken** in de linkerhelft. Als we daar onze eigen tekst overheen leggen, krijgen we dubbele tekst.

**Oplossing:** met `imagegen--edit_image` een schone versie maken waar de tekst en knop verwijderd zijn — alleen de marmeren trap met de producten (tas, pet, t-shirt, jeans) aan de rechterkant blijft, en links blijft de zachte marmeren achtergrond leeg zodat onze overlay daar ademruimte krijgt.

Bestand wordt opgeslagen als `src/assets/classic-hero-clean.jpg` (vervangt `classic-hero.png` in de import).

## Aanpak

### 1. Schone hero-afbeelding genereren
- `imagegen--edit_image` op `user-uploads://image-75.png`
- Prompt: verwijder alle tekst en de zwarte knop aan de linkerkant, behoud de marmeren textuur en producten exact zoals ze zijn.
- Aspect ratio 16:9, opslaan als `src/assets/classic-hero-clean.jpg`.

### 2. `src/pages/classic/ClassicHome.tsx` — hero herschrijven

Vervang het huidige hero-blok (lijn 17–59) door één full-bleed sectie met de schone foto als achtergrond en een tekstoverlay links:

```text
┌──────────────────────────────────────────────────────────┐
│ ─── MANCINI MILANO CLASSIC — FW 26 ───                   │
│                                                          │
│   TIMELESS STYLE.        [ producten op marmer ]         │
│   MADE TO LAST.                                          │
│   ─                                                      │
│   Refined essentials crafted                             │
│   with premium materials…                                │
│                                                          │
│   [ SHOP COLLECTION ]                                    │
└──────────────────────────────────────────────────────────┘
```

**Structuur:**
- `<section className="relative w-full overflow-hidden bg-secondary">`
- Gouden eyebrow-rule blijft bovenaan (zoals nu).
- Daaronder: `<div className="relative">` met `<img>` als full-width achtergrond (`w-full h-auto`, `object-cover` op desktop met vaste `aspect-[16/9]` of `min-h-[80vh]`).
- Daarbovenop een `absolute inset-0` overlay-container met `max-w-site mx-auto px-6 lg:px-12 flex items-center`:
  - **Heading** in `font-classic` (Playfair), uppercase variant niet — gebruik exact dezelfde Playfair-look als de afbeelding had: `text-4xl lg:text-6xl font-light text-foreground leading-[1.05]`. Eerste regel "Timeless Style." in `text-foreground`, tweede regel "Made To Last." in `text-classic-gold`.
  - Kleine gouden divider (`w-10 h-px bg-classic-gold`).
  - Body `text-sm lg:text-base text-muted-foreground max-w-sm`.
  - CTA: `<Link to="/classic/collections/all">` met `bg-foreground text-background px-10 py-4 text-[11px] uppercase tracking-[0.25em] hover:bg-classic-gold hover:text-background transition-colors`.
- Subtiele witte/cream gradient links over de foto (`bg-gradient-to-r from-secondary/85 via-secondary/40 to-transparent`) om de tekst leesbaar te houden op alle viewports.

**Mobiel (<lg):**
- Foto behoudt natuurlijke aspect ratio.
- Overlay wordt onderaan/centered geplaatst met sterkere gradient van onder (`from-secondary via-secondary/70 to-transparent`) zodat tekst leesbaar blijft over de producten. Alternatief: tekst onder de foto stacken in plaats van overlay als de leesbaarheid eronder lijdt — beslissen tijdens implementatie na visuele check.

### 3. Oude CTA-bar verwijderen
De aparte CTA-balk onder de afbeelding (lijn 47–58) vervalt — body + knop zitten nu in de overlay.

### 4. Oude asset
`src/assets/classic-hero.png` blijft staan (geen delete) tot bevestigd dat alles werkt; import wordt vervangen door `classic-hero-clean.jpg`.

## Niet aanpassen

- Eyebrow-rule, value-props strip, brand story, "Signature Details" band, launch teaser → alles ongemoeid.
- Geen wijzigingen aan Streetwear-home, routing, of design tokens.

## Vraag

Akkoord dat ik de geüploade foto eerst laat retoucheren (tekst + knop weghalen) zodat onze eigen overlay zuiver toont? Indien je liever een eigen schone versie aanlevert, upload die dan en ik gebruik 'm direct.
