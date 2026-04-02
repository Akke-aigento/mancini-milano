

# Dropdowns Alleen Omhoog op Homepage

## Probleem
De dropdowns gaan nu omhoog wanneer `!scrolled`, ook op niet-homepage pagina's. Ze moeten alleen omhoog gaan op de homepage wanneer de navbar onderaan staat.

## Oplossing

### `src/components/layout/Navbar.tsx`

1. **DropdownMenu component**: voeg `isHome` prop toe. Verander de logica:
   - Dropdown omhoog: alleen als `isHome && !scrolled`
   - Chevron rotatie: alleen als `isHome && !scrolled`

2. **Navbar render**: pass `isHome` door naar beide `<DropdownMenu>` componenten

### Wijzigingen

**DropdownMenu props** (regel 9):
```
{ label, links, slug, scrolled, isHome }
```

**Chevron** (regel 23):
```
${isHome && !scrolled ? 'rotate-180' : ''}
```

**Dropdown positie** (regel 26):
```
${!isHome || scrolled ? 'top-full pt-2' : 'bottom-full pb-2'}
```

**Navbar render** (~regel 147-148): pass `isHome={isHome}` aan beide DropdownMenu's

### Eén file
- `src/components/layout/Navbar.tsx`

