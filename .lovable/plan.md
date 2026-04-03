

# Logo: Altijd Dobermann, Gecentreerd op Mobiel

## Wijzigingen in `src/components/layout/Navbar.tsx`

### 1. Navbar — Logo altijd Dobermann (regel 146-155)
- Verwijder de tekst-`<span>` ("Mancini Milano") en de crossfade-logica
- Toon altijd alleen de Dobermann-afbeelding
- **Desktop (lg+)**: logo blijft links (huidige positie)
- **Mobiel**: logo gecentreerd — verplaats de Link naar het midden van de navbar met `lg:relative absolute left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0`

### 2. Mobiel menu header (regel 226-229)
- Vervang de tekst "Mancini Milano" door het Dobermann-logo (`<img>`) in de open-menu header

### Eén file, twee locaties

