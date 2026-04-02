

# Kleurenschema: Goud → Wit + Announcement Bar Zwart

## Wat verandert

**Primary kleur** gaat van goud (`38 43% 60%`) naar wit (`0 0% 100%`), met zwarte tekst erop (`primary-foreground` blijft `0 0% 0%`). Dit raakt automatisch alle knoppen, labels, prijzen, links die `text-primary`, `bg-primary`, `hover:bg-gold-hover` gebruiken.

**Ring** kleur ook naar wit.

**Gold custom variabelen** worden ook wit zodat `hover:bg-gold-hover` en `hover:text-gold-hover` consistent blijven.

**Announcement Bar** krijgt een zwarte achtergrond met witte tekst — dit wordt `bg-background text-foreground` (want background = zwart, foreground = wit).

## Wijzigingen

### 1. `src/index.css` — CSS variabelen
- `--primary: 0 0% 100%` (wit)
- `--primary-foreground: 0 0% 0%` (zwart — tekst op witte knoppen)
- `--ring: 0 0% 100%`
- `--gold: 0 0% 100%`
- `--gold-hover: 0 0% 85%` (lichtgrijs hover voor witte knoppen)

### 2. `src/components/layout/AnnouncementBar.tsx`
- Van `bg-primary text-primary-foreground` → `bg-background text-foreground border-b border-border`
- Zo wordt het zwart met witte tekst, met een subtiele border eronder

### Twee files
- `src/index.css`
- `src/components/layout/AnnouncementBar.tsx`

