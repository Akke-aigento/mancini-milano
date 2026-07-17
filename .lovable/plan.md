## Doel
Op **desktop** (md en groter) de grote hero-afbeelding met de 3 modellen bovenaan `/streetwear` verwijderen, zodat de header (announcement bar + navbar) direct bovenaan de pagina staat. Op mobiel/tablet blijft alles zoals het nu is (de banner was daar toch al verborgen).

## Wijziging
**`src/components/layout/Layout.tsx`**
- De regel `{isHome && <LookbookBanner />}` verwijderen.
- Import van `LookbookBanner` verwijderen.

Resultaat: de `LookbookBanner` wordt niet meer gerenderd op `/streetwear`. Omdat de banner al `hidden md:block` was, verandert er niets op mobiel/tablet; op desktop verdwijnt de hero volledig en schuift de content direct onder de navbar.

Het bestand `src/components/layout/LookbookBanner.tsx` laten we staan (ongebruikt, geen impact) voor het geval je hem later wil terugzetten. Als je hem meteen wil verwijderen, zeg het en ik doe het mee.

## Validatie
- `/streetwear` op desktop: geen hero-banner meer, navbar staat direct onder de announcement bar.
- `/streetwear` op mobiel: onveranderd.
- Andere pagina's: onveranderd (banner werd daar toch niet getoond).
