

# Navbar & Collection: Gender-based Category Filtering

## Probleem
- "For Him" moet alleen categorieën tonen waar producten in zitten die OOK de categorie `men` hebben
- Als je via "For Him" → "Pants" navigeert, mogen alleen producten getoond worden die in BEIDE categorieën zitten (`men` + `pants`)
- Zelfde logica voor "For Her" met slug `women`

## Aanpak

Omdat we niet weten of de API meerdere `category_slug` filters tegelijk ondersteunt, gebruiken we een twee-stappen benadering:

### 1. Product type & normalizer uitbreiden
- Voeg `categories?: Category[]` (meervoud) toe aan de `Product` interface in `types.ts`
- In de normalizer: `categories: raw.categories || []` opslaan zodat we per product weten in welke categorieën het zit

### 2. Navbar: gender-aware dropdown links
- Fetch producten met `category_slug=men` via een nieuwe `useProducts({ category_slug: 'men' })` in de Navbar
- Uit die producten de unieke categorieën extraheren (excl. "men" zelf) → dat worden de "For Him" dropdown links
- Zelfde voor "For Her" met `category_slug=women`
- Links worden: `/collections/pants?gender=men` (query param meegeven)

### 3. Collection page: dual filtering
- Lees `?gender=men` of `?gender=women` uit de URL query params
- Als `gender` param aanwezig is: fetch producten met `category_slug={slug}` EN filter client-side op producten die ook de gender-categorie hebben in hun `categories` array
- Titel wordt dan bijv. "Pants — For Him"
- Subcategory pills updaten: als gender context aanwezig is, pills linken ook met `?gender=men`

### 4. "All" dropdown
- Blijft ongewijzigd — toont alle categorieën met producten, ongeacht gender

## Files
- `src/integrations/sellqo/types.ts` — `categories` field toevoegen
- `src/integrations/sellqo/normalizer.ts` — `categories` mappen
- `src/components/layout/Navbar.tsx` — gender-aware dropdown building
- `src/pages/Collection.tsx` — query param lezen + client-side filter

## Risico
Als de raw API geen `categories` array per product terugstuurt (alleen `category` enkelvoud), werkt de client-side filtering niet. In dat geval moeten we:
- Alle producten fetchen voor `men` category 
- En die vergelijken (intersectie) met producten uit de subcategorie

We implementeren eerst de `categories` array aanpak en vallen terug op de intersectie-methode als het niet werkt.

