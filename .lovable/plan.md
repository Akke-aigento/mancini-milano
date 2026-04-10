

# Cart Drawer: Verzendkosten tekst aanpassen

In de CartDrawer staat nu "Shipping → Free". Dit moet worden gewijzigd naar "Calculated at checkout" (of "Calculated in next step"), aangezien verzendkosten pas bij de checkout worden berekend en alleen gratis zijn boven €150.

## Wijziging

| Bestand | Wat |
|---|---|
| `src/components/CartDrawer.tsx` | "Free" vervangen door "Calculated at checkout" bij de Shipping-regel |

