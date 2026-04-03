

# Doberman Logo: Achtergrond Verwijderen

## Probleem
Het `logo-doberman.png` bestand heeft een zwarte achtergrond die net iets anders is dan de navbar-achtergrond (`bg-background/80` met backdrop-blur), wat een zichtbaar kleurverschil oplevert.

## Oplossing

### `src/assets/logo-doberman.png`
Vervang het huidige PNG-bestand door een versie met transparante achtergrond. Dit kan gedaan worden door:
- De zwarte achtergrond uit het bestand te verwijderen met ImageMagick (automatisch, in de build-omgeving)
- Het commando `convert logo-doberman.png -fuzz 15% -transparent black logo-doberman.png` verwijdert de zwarte pixels en maakt ze transparant

### Alternatief (CSS-only, geen bestandswijziging)
Als de afbeelding niet gewijzigd kan worden, kan `mix-blend-mode: screen` op de `<img>` tag gezet worden. Dit maakt zwarte pixels onzichtbaar tegen een donkere achtergrond. Nadeel: kan lichte delen van het logo ook beïnvloeden.

**Aanbeveling**: bestandswijziging (transparante achtergrond) geeft het schoonste resultaat.

### Eén asset-bestand

