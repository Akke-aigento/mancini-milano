## Plan

Ik ga de mobiele/tablet hamburger-overlay robuust fixen zodat de achterliggende pagina niet meer kan meescrollen.

### Wijzigingen
- In `src/components/layout/Navbar.tsx` vervang ik de huidige simpele body-lock door een stevigere scroll lock:
  - huidige `window.scrollY` bewaren
  - `body` vastzetten met `position: fixed`
  - `top` negatief zetten op de huidige scrollpositie
  - `width: 100%` zetten zodat layout niet verspringt
  - `overflow: hidden` behouden
  - bij sluiten/unmount alles herstellen en terug naar dezelfde scrollpositie gaan
- Op de fullscreen menu-overlay voeg ik scroll-isolatie toe:
  - `overscroll-contain`
  - `touch-none` op de buitenlaag waar nodig
  - de menu-content zelf blijft `overflow-y-auto`, zodat het menu nog altijd kan scrollen als het hoger is dan het scherm

### Validatie
- Testen op mobiel viewport `/streetwear`:
  - pagina naar beneden scrollen
  - hamburger openen
  - swipen/scrollen in het menu
  - controleren dat de achtergrondpagina op exact dezelfde positie blijft
  - hamburger sluiten en controleren dat de pagina niet naar boven springt