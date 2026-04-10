

# Mobiele footer: maatselector heropenen + direct toevoegen

## Probleem
Na het selecteren van een maat sluit de maatselector en kan deze niet meer geopend worden. De gebruiker kan geen andere maat kiezen of de selectie wijzigen vanuit de footer.

## Oplossing
De maatselector altijd kunnen heropenen, ook als er al een maat geselecteerd is. De geselecteerde maat tonen in de footer-knop en bij klik op de maat in de selector direct toevoegen aan winkelmandje.

## Wijzigingen

| Bestand | Wat |
|---|---|
| `src/pages/ProductDetail.tsx` (regels 348-398) | Footer aanpassen |

### Gedrag
1. Footer-knop toont geselecteerde maat (bijv. "Add to Cart – M") als er een maat is gekozen
2. Klik op de geselecteerde maat-tekst of een "Change size" link opent de selector opnieuw
3. In de maatselector: klik op een maat → selecteert de maat, sluit de selector, en voegt direct toe aan winkelmandje
4. De "Add to Cart" knop blijft werken als er al een maat geselecteerd is

### Implementatie
- Footer-knop `onClick`: altijd `setShowSizeSelector(true)` tonen als `needsSize`, ongeacht of er al een maat is
- Maatselector `onClick` per maat: `setSelectedSize(size)` → `setShowSizeSelector(false)` → direct `handleAddToCart()` aanroepen
- Knoptekst updaten: als maat geselecteerd → "Add to Cart" (knop voegt toe), als niet → "Select Size" (knop opent selector)

