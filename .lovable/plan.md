## Doel

De geüploade foto (`PHOTO-2026-05-19-11-00-14.jpg`) gebruiken als visuele basis voor de splash/keuzepagina (`/`), in plaats van de huidige Unsplash-stockafbeeldingen.

De foto is één beeld met twee helften:
- **Bovenste helft** → man met zwarte Mancini Milano hoodie → past bij **Streetwear**
- **Onderste helft** → man met blazer + polo → past bij **Classic**

## Aanpak

1. **Foto importeren als project-assets** (gesplitst in twee bestanden zodat elke helft scherp kan worden ingeladen en goed crop't binnen zijn eigen kolom/rij):
   - `src/assets/splash-classic.jpg` — onderste helft (blazer)
   - `src/assets/splash-streetwear.jpg` — bovenste helft (hoodie)
   - Gesplitst via een eenmalig shellscript (ImageMagick) op basis van de originele upload.

2. **`src/pages/Splash.tsx` aanpassen**:
   - Vervang de twee Unsplash `<img src="https://images.unsplash.com/...">` door ES6-imports van de nieuwe assets.
   - Classic-helft krijgt `splash-classic.jpg`, Streetwear-helft krijgt `splash-streetwear.jpg`.
   - `alt`-teksten en `object-cover` behouden; eventueel `object-position` finetunen zodat het gezicht/logo mooi in beeld blijft op mobiel (390px) en desktop.
   - Overlay/gradient, typografie, knoppen, links en layout blijven exact zoals nu — alleen de achtergrondbeelden veranderen.

3. **Niet aanraken**:
   - Routing, WorldContext, Navbar, Layout, sticky-header fix.
   - Knopteksten ("Discover Classic" / "Discover Streetwear"), heading-structuur, SEO-tags.
   - Andere pagina's of componenten.

## Verificatie

- `/` openen op mobiel (390×720) en desktop → beide helften tonen de nieuwe foto, scherp, met juiste uitsnede.
- Klikken op Classic-helft → `/classic`. Klikken op Streetwear-helft → `/streetwear`.
- Geen console errors, geen layout-shift, geen broken images.

## Open vraag (optioneel)

Wil je dat ik de foto ook in **hogere resolutie** lever (1600px breed) en/of dat ik een lichte **donkere overlay** behoud zoals nu zodat de witte tekst leesbaar blijft over de blazer-/hoodie-foto? Mijn default: ja op beide — overlay behouden voor leesbaarheid, en de gesplitste assets exporteren op volle originele resolutie.
