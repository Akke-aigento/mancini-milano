

# Fix: "Shop Men" & "Shop Women" Knoppen — Correcte Navigatie

## Probleem
De knoppen linken naar `/collections/for-him` en `/collections/for-her`. Maar de gender-categorieën gebruiken de slugs `men` en `women` (niet `for-him`/`for-her`). De navigatie-dropdowns in de navbar gebruiken al correct `/collections/men` en `/collections/women`.

## Wijziging

### `src/pages/Index.tsx`

Vier Link-componenten updaten (2× mobiel, 2× desktop):

- `to="/collections/for-him"` → `to="/collections/men"`
- `to="/collections/for-her"` → `to="/collections/women"`

Regels 75, 81, 108, 114.

### Eén file, vier regels

