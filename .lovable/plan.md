## Wijzigingen

### 1. `src/pages/classic/ClassicHome.tsx` — eyebrow-balk weg
Verwijder de "Mancini Milano Classic — FW 26"-rij met de twee gouden lijntjes (lijn 19–26). De hero begint dan direct met de campagnefoto.

### 2. `src/components/WorldSwitch.tsx` — mobiele swap-knop verfijnen
- `h-9 w-9` → `h-8 w-8` (36 → 32px)
- Icoon `size={15}` → `size={13}`
- Border-opaciteit iets dunner: `border-classic-gold/60` → `/50` en `border-foreground/40` → `/30`

### 3. `src/components/layout/Navbar.tsx` — switch dichter bij cart
Mobiele rechter cluster (lijn 171): `gap-2` → `gap-0.5`. Cart-knop behoudt zijn 44×44 touch target.

## Niet aanpassen
Desktop world-switch, `full`-variant in mobile menu, en rest van het navbar-cluster blijven ongemoeid.
