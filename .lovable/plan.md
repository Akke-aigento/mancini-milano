

# Doberman Logo als Favicon, Deelafbeelding & Meta Update

## Wat verandert

1. **Favicon** — Het Doberman-logo (`src/assets/logo-doberman.png`) wordt gekopieerd naar `public/favicon.png` en ingesteld als favicon. Het bestaande `public/favicon.svg` wordt verwijderd.

2. **Deelafbeelding (og:image)** — Het Doberman-logo wordt ook gekopieerd naar `public/og-image.png` zodat het als absolute URL beschikbaar is voor social sharing.

3. **Meta-tags in `index.html`** — Alle placeholder-teksten worden vervangen:
   - `<title>` → "Mancini Milano — Italian Luxury Streetwear"
   - `meta description` → "Premium Italian streetwear. Elevated essentials for those who move with authority."
   - `og:title` / `twitter:title` → "Mancini Milano — Italian Luxury Streetwear"
   - `og:description` / `twitter:description` → "Premium Italian streetwear. Elevated essentials for those who move with authority."
   - `og:image` / `twitter:image` → `/og-image.png`
   - `twitter:site` → `@mancinimilanostore`
   - `meta author` → "Mancini Milano"
   - Verwijder de TODO-comments

## Bestanden

| Bestand | Actie |
|---|---|
| `public/favicon.png` | Kopieer logo-doberman.png |
| `public/og-image.png` | Kopieer logo-doberman.png |
| `public/favicon.svg` | Verwijderen |
| `index.html` | Favicon link + alle meta-tags updaten |

