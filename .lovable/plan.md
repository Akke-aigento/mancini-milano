

## Fix: Vrouwen subcategorieën onterecht "Coming Soon"

### Probleem
Op de parent-pagina (`/collections/women`) wordt `useProducts({ category_slug: 'women' })` aangeroepen. De `hasProducts` check zoekt dan of producten uit die fetch een subcategorie-slug zoals `jackets-women` in hun `categories` array hebben. Als de API die subcategorie-tags niet meelevert bij parent-producten, toont alles "Coming Soon" — ook categorieën die wél producten bevatten.

### Oplossing
Verwijder de `hasProducts`-check op basis van parent-producten. In plaats daarvan: maak **alle subcategorieën klikbaar** op de parent-pagina. De "Coming Soon" state wordt al correct afgehandeld op de subcategorie-pagina zelf (als er geen producten zijn). Dit maakt de parent-pagina puur een navigatie-overzicht.

### Wijziging

**`src/pages/Collection.tsx`** (regels 104-145):
- Verwijder de `hasProducts` check en het "Coming Soon" blok
- Render alle subcategorieën als klikbare `<Link>`-kaarten
- Elke subcategorie is altijd bereikbaar; lege categorieën tonen hun eigen "Coming Soon" op de subcategorie-pagina

### Resultaat
- `jackets-women` (en alle andere subcategorieën met producten) zijn direct klikbaar
- Geen afhankelijkheid meer van de parent-fetch om beschikbaarheid te bepalen
- Simpelere, betrouwbaardere code

