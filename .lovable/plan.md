

# Fix: "For Her" Verschijnt Niet Ondanks Product in Women

## Oorzaak

De `forHerLinks` logica (regel 117-128) haalt alle producten op met `category_slug: 'women'`, en bouwt dan een lijst van **subcategorieën** (alles behalve `women`/`for-her`). 

Als het product dat je net hebt toegevoegd alleen de categorie `women` heeft en geen andere subcategorie (zoals `bags`, `pants`, etc.), dan is `forHerLinks` leeg → dropdown wordt niet getoond.

Daarnaast: React Query cached de response. Na het toevoegen van een product in SellQo moet de pagina herladen worden (of de cache verversen).

## Twee fixes

### 1. Cache: kortere staleTime voor navbar-data
Standaard React Query staleTime is `0` maar de data wordt gecached. Door een expliciete `staleTime` van 2 minuten in te stellen op de product queries in de navbar, en de categories query, wordt de data regelmatig ververst.

### 2. Logica: "For Her" ook tonen als er alleen gender-producten zijn
Als er producten bestaan onder `women` maar geen subcategorieën gevonden worden, toon "For Her" als een **gewone link** (zonder dropdown) naar `/collections/women` — net zoals "Fragrances" een gewone link is.

## Wijzigingen

### `src/components/layout/Navbar.tsx`

**Desktop nav (rond regel 160-170):**
- Als `forHerLinks.length > 0`: toon als DropdownMenu (huidige gedrag)
- Als `forHerLinks.length === 0` maar `womenProducts && womenProducts.length > 0`: toon als gewone Link naar `/collections/women`
- Zelfde logica voor "For Him"

**Mobiel menu:**
- Zelfde aanpassing: als geen subcategorieën maar wel producten, toon als gewone link i.p.v. accordion

### Eén file
- `src/components/layout/Navbar.tsx`

