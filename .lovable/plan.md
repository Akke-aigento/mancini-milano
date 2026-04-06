

# Navbar: "ALL" Dropdown Verwijderen

## Wijziging

Verwijder het "All" menu-item uit de navigatie op alle viewports (desktop, tablet, mobiel). Alleen deze items blijven over: Home, For Him, For Her, Fragrances, Contact.

## `src/components/layout/Navbar.tsx`

1. **Verwijder de `allLinks` variabele** (regels ~113-119) — de `parentSlugsToExclude` en `allLinks` berekening is niet meer nodig
2. **Desktop nav** — verwijder het `{allLinks.length > 0 && <DropdownMenu label="All" .../>}` blok
3. **Mobiel menu** — verwijder het `{allLinks.length > 0 && <MobileAccordion label="All" .../>}` blok

Eén bestand, drie verwijderingen.

