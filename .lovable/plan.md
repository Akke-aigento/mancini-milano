

# Plan: Navigatie & Footer aanpassingen

## 4 wijzigingen

### 1. "View All For Him/Her" verwijderen uit mobiele accordeon
**Bestand:** `src/components/layout/Navbar.tsx` (regels 60-66)
Verwijder het `<Link>` blok met "View All {label}" uit de `MobileAccordion` component.

### 2. CTA "Shop Men/Women" toont subcategorieën
**Bestand:** `src/pages/Collection.tsx` (regel 57)
Het probleem: `parentCategories` bevat `['for-him', 'for-her']` maar de daadwerkelijke slugs zijn `'men'` en `'women'`. Hierdoor worden de subcategorie-pills niet getoond.
Fix: wijzig naar `['men', 'women']`.

### 3. "Bags" toevoegen als subcategorie
**Bestand:** `src/components/layout/Navbar.tsx` (regels 102-109)
Voeg `{ label: 'Bags', slug: 'bags' }` toe tussen Tracksuits en Accessories in `FIXED_SUBCATEGORIES`.

**Bestand:** `src/pages/Collection.tsx`
De subcategorie-pills worden opgebouwd uit API-categorieën (via `collection?.id` en `parent_id`). Als "Bags" in SellQo correct als subcategorie staat, verschijnt het automatisch. Maar als fallback moeten we ook de hardcoded lijst in Collection.tsx updaten — momenteel wordt die niet gebruikt voor de pills, dus dit vereist geen extra wijziging.

### 4. Footer: alleen For Him, For Her, Fragrance
**Bestand:** `src/components/layout/Footer.tsx` (regels 27-33)
Vervang de huidige Shop-links door:
- For Him → `/collections/men`
- For Her → `/collections/women`  
- Fragrances → `/collections/fragrances`

## Bestanden

| Bestand | Wijziging |
|---|---|
| `src/components/layout/Navbar.tsx` | "View All" weg + "Bags" toevoegen |
| `src/pages/Collection.tsx` | parentCategories fix: `men`/`women` |
| `src/components/layout/Footer.tsx` | Shop-links vereenvoudigen |

