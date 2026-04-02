

# Fix: For Her Fallback + Sorteer Alle Dropdowns op Positie

## Twee problemen

### 1. "For Her" toont fallback categorieën
Als er geen producten met categorie `women` bestaan, valt de code terug op `defaultForHerLinks` (hardcoded). Dit moet weg — als er geen women-producten zijn, moet de dropdown leeg zijn (en dus niet getoond worden).

### 2. Volgorde komt niet overeen met SellQo
De categorieën in de dropdowns worden nu in willekeurige volgorde getoond (Map insertion order). De `Category` interface heeft al een `position` veld — we moeten hier op sorteren.

## Wijzigingen

### `src/components/layout/Navbar.tsx`

**forHimLinks (regel 118-130):**
- Verwijder fallback naar `defaultForHimLinks` — return `[]` als er geen men-producten zijn
- Bewaar `position` uit de categorie naast slug/name
- Sorteer op `position` voor return

**forHerLinks (regel 132-144):**
- Zelfde aanpak — geen fallback, return `[]`
- Sorteer op `position`

**allLinks (regel 146-152):**
- Sorteer op `position` (categories uit de API hebben dit veld al)

**Desktop nav + mobiel menu:**
- Toon "For Her" dropdown alleen als `forHerLinks.length > 0` (zelfde als "All" al doet)
- Zelfde check voor "For Him"

### Eén file
- `src/components/layout/Navbar.tsx`

