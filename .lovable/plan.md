

# Fix: Favicon & Deelafbeelding — Zwarte Doberman

## Probleem
De favicon en og-image gebruiken `logo-doberman.png` (witte versie). De gebruiker wil de originele zwarte Doberman uit `src/assets/hero-doberman.png`.

## Oplossing

1. **Kopieer `src/assets/hero-doberman.png`** naar `public/favicon.png` en `public/og-image.png` (overschrijf de huidige witte versie)
2. Het `hero-doberman.png` bestand is groot (2.3MB) — voor het favicon wordt het verkleind naar ~128x128px. Voor og-image naar ~1200x630px.

## Eén commando, twee bestanden overschreven

| Bestand | Actie |
|---|---|
| `public/favicon.png` | Overschrijven met hero-doberman (verkleind) |
| `public/og-image.png` | Overschrijven met hero-doberman (verkleind) |

