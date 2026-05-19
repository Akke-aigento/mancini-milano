## Doel

De aparte `WorldSwitch`-balk boven de navbar verdwijnt. De Streetwear/Classic-toggle wordt onderdeel van de bestaande action-bar in de navbar — strak, niet-storend, en bewust anders op mobiel waar de ruimte schaars is.

## Aanpak

### 1. `WorldSwitch` herschrijven naar een inline pill (responsive)

Bestand: `src/components/WorldSwitch.tsx`

Het wordt geen standalone-balk meer, maar een herbruikbaar component dat in de navbar past:

- **Desktop (lg+)**: een compacte pill met beide labels `STREETWEAR | CLASSIC`, ~10px font, uppercase, tracking-wide. Actieve helft krijgt goud (classic) of accent (streetwear) achtergrond. Inline naast Search/Account/Cart.
- **Mobiel (<lg)**: een mini-toggle van **alleen initialen** `S | C` in een smal pill (≈48px breed, 32px hoog). Past tussen hamburger/search en blok of net voor het account-icoon zonder de gecentreerde logo te raken. Gouden rand op classic, neutrale rand op streetwear. Tap = direct switchen. `aria-label` blijft volledig ("Switch to Classic").

Geen popover, geen extra UI — één tap = wissel, net zoals nu.

### 2. `WorldSwitch` uit het Layout halen

Bestand: `src/components/layout/Layout.tsx`

- Regel 19 (`<WorldSwitch />` boven `AnnouncementBar`) verwijderen.
- De `AnnouncementBar` (Free shipping ...) blijft staan en wordt nu de bovenste regel — voelt meteen rustiger.

### 3. `WorldSwitch` plaatsen in `Navbar.tsx`

Bestand: `src/components/layout/Navbar.tsx`

Twee inserts, want mobiel en desktop hebben aparte action-clusters:

- **Mobiel right cluster (lijn 177)**: vóór het `User`-icoon de mini-toggle plaatsen (`S | C`). De cluster gebruikt `gap-1`, dus de toggle krijgt een eigen `mx-1` voor optische ademruimte. Door initialen + 48px breedte botst dit niet met het centrale logo bij iPhone SE-formaat (320px).
- **Desktop right cluster (lijn 200)**: de volledige pill (`STREETWEAR | CLASSIC`) net vóór de Search-knop. Krijgt extra `mr-2` zodat de iconen visueel apart blijven.

Op routes waar `currentWorld` null is (cart, checkout, account, login) blijft het component zichzelf onzichtbaar maken — die guard zit al in `WorldSwitch`.

### 4. Mobiele menu-paneel (sidebar overlay)

Het volledige mobiel menu (lijn 231+) krijgt onderaan, vlak boven de "About Us / FAQ"-blok, een full-width versie van dezelfde toggle met volledige labels. Zo heeft de gebruiker daar ook nog een duidelijke entry — bonus voor wie de mini-pill in de header over het hoofd ziet.

## Visueel

```text
DESKTOP NAVBAR
┌─────────────────────────────────────────────────────────────────────┐
│ LOGO    Home  ForHim  ForHer  Fragrances  Contact   [STREETWEAR│CLASSIC]  🔍 👤 🛍 │
└─────────────────────────────────────────────────────────────────────┘

MOBIEL NAVBAR
┌──────────────────────────────────────────┐
│ ☰ 🔍        MANCINI MILANO        [S│C] 👤 🛍 │
└──────────────────────────────────────────┘
```

Actieve helft = goud-fill op Classic, accent-fill op Streetwear, witte/zwarte tekst — consistent met de huidige stijl.

## Niet aanpassen

- Geen wijzigingen aan `AnnouncementBar`, `Footer`, `WorldContext`, of de Classic-hero die we net hebben gezet.
- Geen kleurtokens veranderen — we hergebruiken `classic-gold`, `accent`, `border`.
- Streetwear-pagina's blijven identiek qua ritme; alleen de extra balk bovenaan is weg.

## Vervolgnoot

Mocht de mini-pill op mobiel toch knel komen bij heel lange logos of extra knoppen, dan kunnen we hem verplaatsen naar het uiterste rechts (na 🛍) of vervangen door een enkele swap-icoon (`⇄`) die direct toggled.