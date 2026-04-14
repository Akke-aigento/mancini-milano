

## Fix: Grijze categorie-kaarten op parent pagina's

### Probleem
Op `/collections/women` (en `/collections/men`) zijn de subcategorie-kaarten zonder afbeelding nog steeds zichtbaar als donkergrijze vlakken. Dit komt doordat:
- Regel 111: `bg-background` op de container (puur zwart, maar de fallback-div erbinnen is `bg-foreground/5` = licht grijs)
- De combinatie van het zwarte vlak + de lichte overlay maakt het zichtbaar als een grijs blok

### Oplossing
Verwijder de grijze fallback-achtergrond volledig. Maak de kaarten zonder afbeelding **transparant** met alleen de tekst en een subtiele border, zodat ze naadloos opgaan in de zwarte pagina-achtergrond.

### Wijziging

**`src/pages/Collection.tsx`** (regels 111-125):
- Container: vervang `bg-background` door geen achtergrond, voeg een subtiele `border border-border` toe
- Fallback (geen afbeelding): verwijder `bg-foreground/5`, maak het volledig transparant — alleen de label-tekst blijft zichtbaar
- Hover-overlay: verwijder de `bg-background/10` hover zodat er geen grijze tint verschijnt

### Resultaat
Categorie-kaarten zonder afbeelding zijn volledig zwart met alleen een subtiele border en de categorienaam — geen grijze vlakken meer.

