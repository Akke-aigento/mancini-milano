

# Navbar: Dynamische "All" Dropdown + For Him/For Her met Niet-Lege Categorieën

## Wat
1. **Nieuw "All" dropdown** in de navbar — toont alle categorieën die `product_count > 0` hebben (geen lege categorieën). Alleen top-level of subcategorieën met producten.
2. **For Him / For Her dropdowns** — tonen alleen subcategorieën die daadwerkelijk producten bevatten (`product_count > 0`).
3. Zelfde logica voor het mobiele menu (accordions).

## Aanpak

### `src/components/layout/Navbar.tsx`

**Filtering logica:**
- Gebruik `category.product_count` (al beschikbaar in de API response) om lege categorieën uit te filteren
- `allLinks`: alle categorieën waar `product_count > 0`, exclusief parent-categorieën zoals "for-him" en "for-her" zelf (die zijn al aparte dropdowns)
- `himLinks`: subcategorieën van "for-him" waar `product_count > 0`
- `herLinks`: subcategorieën van "for-her" waar `product_count > 0`

**Desktop nav (regel 147-158):**
```
Home | All ▼ | For Him ▼ | For Her ▼ | Fragrances | Contact
```
- Voeg een nieuwe `<DropdownMenu label="All" links={allLinks} slug="all" ... />` toe tussen Home en For Him

**Mobiel menu (regel 213-222):**
- Voeg een `<MobileAccordion label="All" slug="all" links={allLinks} ... />` toe

**Fallback defaults** worden ook gefilterd: als de API nog niet geladen is, tonen de hardcoded defaults. Als de API wél geladen is maar alles leeg is, wordt de dropdown niet getoond.

### Eén file
- `src/components/layout/Navbar.tsx`

