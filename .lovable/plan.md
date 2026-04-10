

# Plan: Fix afbeeldingsvolgorde + Categorie-overzicht bij "Shop Men/Women"

## Probleem 1: Verkeerde hoofdafbeelding (bv. "No Face")

De normalizer in `normalizer.ts` mapt afbeeldingen maar **sorteert ze niet op `position`**. Als de API afbeeldingen in willekeurige volgorde stuurt, toont de ProductCard de verkeerde afbeelding als eerste.

**Fix:** Na het mappen van images, sorteer op `position`:

```typescript
// normalizer.ts — na de images map
const images: ProductImage[] = (Array.isArray(rawImages) ? rawImages : [])
  .map(...)
  .sort((a, b) => a.position - b.position);
```

## Probleem 2: "Shop Men/Women" toont alle producten i.p.v. categorieën

Momenteel linkt "Shop Men" naar `/collections/men` wat álle producten in de "men" categorie toont. De subcategorie-pills verschijnen alleen als de API `parent_id` correct koppelt (mogelijk faalt dit).

De gebruiker wil een **categorie-overzichtspagina** zien: een grid van subcategorieën (Jackets, Hoodies, T-Shirts, etc.) met afbeeldingen, vergelijkbaar met de featured categories op de homepage.

**Fix in `Collection.tsx`:** Wanneer `slug` een parent-categorie is (`men` of `women`), toon een categorie-grid in plaats van een productlijst. Gebruik de `FIXED_SUBCATEGORIES` lijst (dezelfde als in de Navbar) met links naar `/collections/{subcategory}?gender={men|women}`.

```text
Huidige flow:  /collections/men → alle producten + pills bovenaan
Nieuwe flow:   /collections/men → grid van subcategorieën (Jackets, Hoodies, etc.)
               Klik op subcategorie → /collections/jackets?gender=men → producten
```

### Concrete wijzigingen

| Bestand | Wijziging |
|---|---|
| `src/integrations/sellqo/normalizer.ts` | `.sort((a, b) => a.position - b.position)` na images map |
| `src/pages/Collection.tsx` | Als `isParent`: toon categorie-grid met subcategorie-kaarten i.p.v. productgrid. Gebruik hardcoded subcategorie-lijst + API categorie-images waar beschikbaar |

### Categorie-grid design

Elke subcategorie wordt een kaart in een 2-koloms grid (mobiel) / 3-koloms (desktop), met:
- Categorie-afbeelding (van API als beschikbaar)
- Categorienaam
- "Shop Now →" link
- Dezelfde stijl als de featured categories op de homepage

