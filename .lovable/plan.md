

# Logo Crossfade Alleen op Homepage

## Wat
De tekst→doberman crossfade animatie moet alleen op de homepage (`/`) actief zijn. Op alle andere pagina's wordt direct het doberman logo getoond zonder tekst.

## Hoe

### `src/components/layout/Navbar.tsx`
1. Import `useLocation` van `react-router-dom`
2. Bepaal `isHome = location.pathname === '/'`
3. Logo logica aanpassen:
   - **Homepage**: huidige crossfade-gedrag behouden (tekst vervaagt → doberman verschijnt bij scroll)
   - **Andere pagina's**: tekst altijd `opacity-0`, doberman altijd `opacity-100 scale-100`

### Wijziging (regels 2, 104, 135-142)
- Regel 2: voeg `useLocation` toe aan import
- In de Navbar component: `const location = useLocation(); const isHome = location.pathname === '/';`
- Regel 135 (tekst span): `${scrolled || !isHome ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`
- Regel 141 (doberman img): `${scrolled || !isHome ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`

### Eén file
- `src/components/layout/Navbar.tsx`

