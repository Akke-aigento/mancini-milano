## Doel

Op mobiel meer ademruimte maken voor de world-toggle door het account- en zoekicoon weg te halen uit de top action-bar en te verplaatsen naar het hamburger-menu. Tegelijk de toggle zelf verfijnen — kleiner, eleganter, minder bombastisch.

## Aanpak

### 1. Mobiele top-bar opschonen — `src/components/layout/Navbar.tsx`

**Links (huidige hamburger + search cluster, lijn 139–154):** alleen de hamburger laten staan. De search-knop verdwijnt hier.

**Rechts (huidige toggle + account + cart cluster, lijn 177–198):** account-link verdwijnt hier. Alleen `WorldSwitch` + cart blijven.

Resultaat:

```text
MOBIEL NAVBAR (voor)
[☰] [🔍]      MANCINI MILANO      [👟│👔] [👤] [🛍]

MOBIEL NAVBAR (na)
[☰]           MANCINI MILANO            [👟│👔] [🛍]
```

Hierdoor ontstaat aan beide kanten zichtbare ruimte naast het gecentreerde logo, en de toggle valt op zonder geduwd te zitten.

### 2. Search & Account in het hamburger-paneel — zelfde bestand

Het mobiel menu-paneel (lijn 231+) krijgt bovenaan, vlak onder de header van het paneel, een rij met twee inline acties:

```text
┌─────────────────────────────┐
│ 🔍  Search products         │
│ 👤  Account / Inloggen      │
├─────────────────────────────┤
│ Home                        │
│ For Him            ⌄        │
│ ...                          │
```

- **Search-rij**: opent dezelfde `SearchOverlay` via een lokale handler `(setSearchOpen(true); closeMobile())`.
- **Account-rij**: linkt naar `/account` of `/login` afhankelijk van `isAuthenticated`, met label "My Account" of "Sign In".

De bestaande "Mijn Account / Inloggen"-link onderaan in de utility-blok mag dan verdwijnen om duplicatie te vermijden (de visueel prominente versie bovenaan vervangt 'm).

### 3. World-switch verfijnen op mobiel — `src/components/WorldSwitch.tsx`

De `mobile` variant wordt eleganter:

- Hoogte van `h-8` → `h-7` (28px). Nog steeds tapbaar samen met breedte.
- Icoongrootte van 16px → 14px.
- Padding `px-3` → `px-3.5` (iets meer ademruimte links/rechts van het icoon binnen elke helft).
- Border-thickness: `border` blijft, maar krijgt een subtiele `border-classic-gold/50` (was `/70`) zodat de pill rustiger oogt naast het cartlogo.
- Actieve helft behoudt gouden fill — maar met een dunner accent: een 1px inset shadow vervangt later eventueel de full fill. Voor nu: gouden fill blijft (consistent met desktop).

Desktop- en full-varianten blijven exact zoals nu.

## Visueel resultaat

```text
MOBIEL (390px)
┌────────────────────────────────────────────┐
│  ☰         MANCINI MILANO       [👟│👔] 🛍 │
└────────────────────────────────────────────┘

MOBIEL MENU PANEEL
┌────────────────────────────────────────────┐
│   MANCINI MILANO                         ✕ │
├────────────────────────────────────────────┤
│ 🔍  Search products                        │
│ 👤  My Account                             │
├────────────────────────────────────────────┤
│ Home                                       │
│ For Him                                  ⌄ │
│ For Her                                  ⌄ │
│ Fragrances                                 │
│ Contact                                    │
├────────────────────────────────────────────┤
│ About Us · FAQ · Size Guide                │
├────────────────────────────────────────────┤
│ Shop                                       │
│ [    👟 STREETWEAR    │    👔 CLASSIC    ] │
└────────────────────────────────────────────┘
```

## Niet aanpassen

- Desktop-navbar blijft volledig identiek (search/account/cart staan daar prima).
- `WorldContext`, `Layout.tsx`, en alle pagina's blijven ongemoeid.
- Het hamburger-menu zelf qua structuur (accordions, sections) blijft hetzelfde, alleen 1 rij erbij bovenaan en 1 dubbele link weg onderaan.