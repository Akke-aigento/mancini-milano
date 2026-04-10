

# Kortingscode verwijderen uit cart drawer

## Wijziging

| Bestand | Wat |
|---|---|
| `src/components/CartDrawer.tsx` | Het volledige discount code blok verwijderen (input, apply-knop, error/success meldingen, en de "Code applied" tekst). De bijbehorende state variabelen (`code`, `codeError`, `codeSuccess`, `handleApplyCode`) en de `applyDiscount`/`discountCode`/`setDiscountCode` imports kunnen ook weg. Het subtotaal/totaal/shipping overzicht blijft staan. |

De kortingscode functionaliteit op de checkout-pagina (`src/pages/Checkout.tsx`) blijft ongewijzigd.

