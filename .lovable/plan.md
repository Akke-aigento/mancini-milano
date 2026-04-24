
## Doel
Alle bestaande favicon-assets vervangen door de exacte set die jij hebt aangeleverd (gegenereerd via RealFaviconGenerator), zodat browsers én Google overal het correcte hexagon-M logo tonen.

## Wat ik ga doen

### 1. Oude favicon-bestanden verwijderen uit `public/`
- `favicon.ico` (oude versie)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `favicon-96x96.png`
- `apple-touch-icon.png` (oude versie)
- `android-chrome-192x192.png` (oude versie, niet meer nodig — wordt vervangen door `web-app-manifest-192x192.png`)
- `android-chrome-512x512.png` (oude versie, idem)
- `maskable-icon-512x512.png` (vervangen door manifest-versie)

### 2. Nieuwe bestanden plaatsen in `public/`
Vanuit `user-uploads://`:
- `favicon.ico` → `public/favicon.ico`
- `favicon.svg` → `public/favicon.svg`
- `favicon-96x96.png` → `public/favicon-96x96.png`
- `apple-touch-icon.png` → `public/apple-touch-icon.png`
- `web-app-manifest-192x192.png` → `public/web-app-manifest-192x192.png`
- `web-app-manifest-512x512.png` → `public/web-app-manifest-512x512.png`
- `site.webmanifest` → `public/site.webmanifest` (met aangepaste `name` en `short_name` → "Mancini Milano" / "Mancini")

### 3. `index.html` (regels 29-34) updaten
Vervang het huidige favicon-blok door de exacte RealFaviconGenerator-snippet, plus cache-busting query (`?v=2`) zodat browsers en Google's crawler de nieuwe versie ophalen i.p.v. de gecachte oude:

```html
<!-- Favicon — Mancini Milano -->
<link rel="icon" type="image/png" href="/favicon-96x96.png?v=2" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
<link rel="shortcut icon" href="/favicon.ico?v=2" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />
<link rel="manifest" href="/site.webmanifest?v=2" />
```

### 4. `site.webmanifest` aanpassen aan het merk
```json
{
  "name": "Mancini Milano",
  "short_name": "Mancini",
  "icons": [
    { "src": "/web-app-manifest-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/web-app-manifest-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "theme_color": "#000000",
  "background_color": "#000000",
  "display": "standalone"
}
```

## Wat je daarna zelf moet doen
1. Publishen naar productie
2. (Optioneel) Browser hard-refresh (Cmd+Shift+R) om lokaal de nieuwe favicon te zien
3. In **Google Search Console** → URL inspection op `https://mancinimilano.com` → "Request indexing". De favicon in de Google SERP kan alsnog **1 tot 3 weken** duren voor hij ververst — dat ligt volledig bij Google en is buiten onze controle. De cache-busting `?v=2` versnelt dit zoveel mogelijk.

## Wat ik NIET aanraak
- Geen andere SEO/meta/structured-data wijzigingen
- Geen wijziging aan `og-image.png` (blijft zoals het is)
- Geen wijzigingen aan code buiten `index.html` en `public/`
