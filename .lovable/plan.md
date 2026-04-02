

# Dropdown Richting Omkeren Bij Navbar Onderaan

## Concept
Wanneer de navbar onderaan het scherm staat (niet gescrold), openen de dropdown menu's **omhoog**. Zodra de navbar sticky bovenaan zit (gescrold), openen ze normaal **naar beneden**.

## Hoe

### `src/components/layout/Navbar.tsx`

1. **Pass `scrolled` state door naar `DropdownMenu`** als prop
2. **DropdownMenu**: wissel positionering op basis van `scrolled`:
   - `scrolled = false` (navbar onderaan): `bottom-full mb-2` (menu opent omhoog)
   - `scrolled = true` (navbar bovenaan): `top-full pt-2` (menu opent omlaag)
3. **ChevronDown icon**: draai om wanneer niet gescrold (`rotate-180` als `!scrolled`)

### Wijzigingen

**DropdownMenu component** (~regel 10-42):
- Voeg `scrolled` prop toe
- Dropdown container: `className={scrolled ? 'top-full pt-2' : 'bottom-full pb-2'}`
- Chevron: `className={!scrolled ? 'rotate-180' : ''}`

**Navbar render** (~regel 147-148):
- Pass `scrolled` prop: `<DropdownMenu ... scrolled={scrolled} />`

### Resultaat
```
Niet gescrold (navbar onderaan):
┌─────────────┐
│  Submenu     │  ← opent omhoog
│  items       │
└─────────────┘
──── NAVBAR ────

Gescrold (navbar bovenaan):
──── NAVBAR ────
┌─────────────┐
│  Submenu     │  ← opent omlaag
│  items       │
└─────────────┘
```

### Files
- `src/components/layout/Navbar.tsx` — enige wijziging

