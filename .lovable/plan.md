

# Lookbook Banner Alleen op Homepage

## Wat
De LookbookBanner uit Layout halen (wordt nu op elke pagina getoond) en alleen op de homepage renderen.

## Hoe

### `src/components/layout/Layout.tsx`
- Verwijder de `LookbookBanner` import en `<LookbookBanner />` uit de render

### `src/pages/Index.tsx`
- Import `LookbookBanner` en render het direct boven de hero sectie, binnen `<Layout>`

### Resultaat
- Homepage: AnnouncementBar → LookbookBanner → Navbar → content
- Andere pagina's: AnnouncementBar → Navbar → content

