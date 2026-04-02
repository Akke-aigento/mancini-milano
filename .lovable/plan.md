

# Fix: Hele Rij Klikbaar in Mobiel Menu

## Probleem
In de `MobileAccordion` component zijn het label (Link) en de chevron-pijl (button) twee aparte elementen naast elkaar. Als je in de ruimte ertussen klikt, gebeurt er niets.

## Oplossing

### `src/components/layout/Navbar.tsx` — `MobileAccordion` component (regels 49-65)

Vervang de huidige opzet (Link + losse button) door één klikbare `button` die de hele rij beslaat en de accordion opent/sluit. De categorie-naam zelf blijft ook bereikbaar als link in de dropdown-items (of via een tap op de tekst).

Concreet:
- Maak de hele rij één `button` met `onClick={() => setOpen(!open)}` en `w-full flex items-center justify-between`
- Het label en de chevron zitten samen in die button
- De directe link naar de collectie-pagina wordt het eerste item in de dropdown-lijst (bijv. "View All [label]")

Zo is de hele rij klikbaar om de accordion te openen, en de gebruiker kan via "View All" alsnog naar de collectie-pagina navigeren.

### Eén file
- `src/components/layout/Navbar.tsx`

