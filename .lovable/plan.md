

# Dobermann Splash Screen bij Eerste Load

## Concept
Een fullscreen overlay met het Dobermann-logo dat bij page load verschijnt, 2.5 seconden blijft, en dan elegant wegfadet. Een kruisje (X) rechtsboven laat de gebruiker eerder sluiten.

## Technisch

### Nieuw bestand: `src/components/SplashScreen.tsx`
- Fullscreen overlay (`fixed inset-0 z-[100]`) met zwarte achtergrond
- Dobermann-logo gecentreerd, groot (h-32 of groter)
- Animatie: fade-in + subtle scale-up bij mount, fade-out na 2.5s timeout
- X-knop rechtsboven om handmatig te sluiten
- Na fade-out wordt component uit DOM verwijderd via state
- `sessionStorage` check: toon alleen 1x per sessie (optioneel, afhankelijk van voorkeur)

### Wijziging: `src/components/layout/Layout.tsx`
- Import en render `<SplashScreen />` bovenaan in de Layout component

### Animatie details
- **In**: opacity 0→1, scale 0.95→1 over 0.5s ease-out
- **Hold**: 2s op volle opacity
- **Out**: opacity 1→0 over 0.5s ease-out
- Totaal: ~2.5-3s beleving
- CSS transitions via Tailwind + inline styles of keyframes in `tailwind.config.ts`

## Twee files, één nieuw component

