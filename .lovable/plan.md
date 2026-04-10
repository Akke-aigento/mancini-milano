

# Mobiele footer: maatselectie toevoegen

## Probleem
De sticky footer op mobiel toont "Select Size" maar heeft geen maatselector. De gebruiker moet terug omhoog scrollen om een maat te kiezen, wat een slechte UX is.

## Oplossing
De sticky footer uitbreiden met een maatselectie-dropdown of -knoppen wanneer er nog geen maat geselecteerd is. Als de gebruiker op "Select Size" klikt, opent een selectiemenu met de beschikbare maten.

## Technische aanpak

| Bestand | Wijziging |
|---|---|
| `src/pages/ProductDetail.tsx` (regels 347-367) | Sticky footer aanpassen: wanneer `needsSize && !selectedSize`, toon een dropdown/sheet met maatknoppen in plaats van alleen een disabled knop |

### Gedrag
1. Als er **geen maat geselecteerd** is: de "Select Size" knop opent een klein paneel/dropdown met alle beschikbare maten direct in de footer
2. Als er **wel een maat geselecteerd** is: de footer toont de geselecteerde maat + "Add to Cart" knop (zoals nu)
3. Na maat-selectie sluit het paneel automatisch en verandert de knop naar "Add to Cart"

### Implementatie
- State toevoegen: `showSizeSelector` (boolean) voor het tonen/verbergen van de maatknoppen in de footer
- Bij klik op "Select Size" → toggle `showSizeSelector`
- Maatknoppen renderen boven de footer-balk als uitklapbaar paneel
- Geselecteerde maat tonen naast de productnaam

