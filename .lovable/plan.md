

# Knoppen "Discover" & "Subscribe" → Outlined Style

## Wat verandert

Drie knoppen gebruiken nog `bg-primary text-primary-foreground` (solid wit/zwart). Deze worden omgezet naar de outlined stijl: `border border-foreground text-foreground bg-transparent hover:bg-foreground hover:text-background`.

## Wijzigingen

### 1. `src/pages/Index.tsx` — Discover knop (regel 300)
Vervang `bg-primary text-primary-foreground ... hover:bg-gold-hover` door `border border-foreground text-foreground bg-transparent hover:bg-foreground hover:text-background`

### 2. `src/pages/Index.tsx` — Subscribe knop (regel 337)
Zelfde wijziging als hierboven

### 3. `src/components/layout/Footer.tsx` — Subscribe knop (regel 79)
Zelfde wijziging als hierboven

## Drie locaties, twee files

