

# Fix: Login/Account Icoon Ontbreekt op Mobiel

## Probleem
1. **Desktop**: Het User-icoon heeft `hidden sm:flex` (regel 197) — het is dus verborgen op schermen kleiner dan `sm` (640px)
2. **Mobiel hamburger menu**: Er staat geen link naar Login/Account in het mobiele menu

## Wijzigingen

### `src/components/layout/Navbar.tsx`

**1. User icoon altijd tonen in top bar (regel 197):**
- Verander `hidden sm:flex` naar `flex` zodat het icoon ook op mobiel zichtbaar is naast search en cart

**2. Account link toevoegen in mobiel menu (na regel 270):**
- Voeg een Login/Account link toe in de onderste sectie van het mobiele menu
- Conditioneel: "Mijn Account" als ingelogd, "Inloggen" als niet ingelogd
- Linkt naar `/account` of `/login`

### Eén file
- `src/components/layout/Navbar.tsx`

