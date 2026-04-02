

# Mobile Hero: Banner met 3 Mannen i.p.v. Doberman

## Wat
Op mobiel wordt de grote doberman hero-afbeelding vervangen door de lookbook banner foto (3 mannen). De aparte LookbookBanner component wordt op mobiel verborgen (die is dan overbodig). Op desktop blijft alles hetzelfde.

## Wijzigingen

### 1. `src/pages/Index.tsx`
- Import `lookbookBanner` uit `@/assets/lookbook-banner.jpg`
- In de **mobile hero** (regel 70-97): vervang `heroDoberman` door `lookbookBanner` als `src`

### 2. `src/components/layout/LookbookBanner.tsx`
- Verberg op mobiel: verander `div` class van `h-[50vh] md:h-[calc(100vh-100px)]` naar `hidden md:block md:h-[calc(100vh-100px)]`

### Resultaat
```text
MOBIEL:
AnnouncementBar
Navbar (sticky)
Hero met lookbook banner (3 mannen) ← was doberman
...content

DESKTOP (ongewijzigd):
AnnouncementBar
LookbookBanner (3 mannen, groot)
Navbar (footer-achtig)
Hero met doberman
...content
```

### Files
- `src/pages/Index.tsx` — hero image swap op mobiel
- `src/components/layout/LookbookBanner.tsx` — hidden op mobiel

