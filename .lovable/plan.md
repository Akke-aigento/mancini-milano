

# Fix: Varianten met niet-Engelse optiesleutels worden niet gerenderd

## Probleem

De SellQo API stuurt variant-opties als `{ maat: "l" }` (Nederlands). De normalizer lowercased de sleutels correct, maar `ProductDetail.tsx` zoekt hardcoded naar `size` en `color`. Daardoor worden de maat-knoppen niet getoond.

## Oplossing — `src/pages/ProductDetail.tsx`

Maak de size/color detectie flexibel door meerdere sleutelnamen te ondersteunen:

| Concept | Ondersteunde sleutels |
|---|---|
| Size | `size`, `maat`, `taille`, `größe` |
| Color | `color`, `colour`, `kleur`, `couleur`, `farbe` |

### Concrete wijzigingen

1. **Helper functie** — `getOptionValue(options, keys[])` die de eerste match uit een lijst van sleutels retourneert
2. **`sizes` memo** — gebruik `getOptionValue(v.options, SIZE_KEYS)` i.p.v. `v.options?.size`
3. **`colors` memo** — idem met `COLOR_KEYS`
4. **`selectedVariant` memo** — match op dezelfde manier
5. **Label** — toon "Maat" als de gevonden sleutel "maat" is (gebruik de originele sleutelnaam als label)

### Eén bestand

| Bestand | Wijziging |
|---|---|
| `src/pages/ProductDetail.tsx` | Flexibele optiesleutel-detectie voor sizes en colors |

