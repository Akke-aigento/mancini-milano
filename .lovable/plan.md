

# Navbar Terug als "Footer" op Homepage

## Probleem
Door de LookbookBanner naar `Index.tsx` te verplaatsen, komt deze nu **na** de Navbar (in `<main>`). Voorheen stond de banner **tussen** de AnnouncementBar en Navbar, waardoor de Navbar naar de onderkant van het viewport werd geduwd.

## Oplossing
De LookbookBanner moet terug **vóór** de Navbar in de Layout — maar alleen op de homepage. Dit doen we met `useLocation` in Layout.

### `src/components/layout/Layout.tsx`
- Import `useLocation` en `LookbookBanner`
- Check `location.pathname === '/'`
- Render `<LookbookBanner />` conditioneel tussen `<AnnouncementBar />` en `<Navbar />`

### `src/pages/Index.tsx`
- Verwijder de `LookbookBanner` import en render

### Structuur homepage
```text
AnnouncementBar
LookbookBanner  ← vult viewport, duwt navbar naar beneden
Navbar          ← ziet eruit als footer
main content
```

### Andere pagina's
```text
AnnouncementBar
Navbar          ← direct bovenaan
main content
```

### Files
- `src/components/layout/Layout.tsx` (conditionele banner)
- `src/pages/Index.tsx` (verwijder banner)

