

## Fix: Overal `bg-card` → `bg-background` voor afbeelding-containers

### Probleem
Op de productdetailpagina en collectiepagina hebben afbeelding-containers nog `bg-card` (donkergrijs), waardoor er een zichtbaar kleurverschil is rond `object-contain` afbeeldingen.

### Wijzigingen

**1. `src/pages/ProductDetail.tsx`**
- Regel 229: `bg-card` → `bg-background` (hoofdafbeelding container)

**2. `src/pages/Collection.tsx`**
- Regel 120: `bg-card` → `bg-background` (Coming Soon categorie-afbeelding)
- Regel 150: `bg-card` → `bg-background` (actieve categorie-afbeelding)
- Regels 234-236: `bg-card` → `bg-background` (loading skeleton placeholders)

### Niet aanraken
- Formulier-inputs (`bg-card` op Contact, select dropdowns) — dat zijn geen afbeelding-containers
- UI-componenten (avatar, chart, etc.)

