

# Checkout: prijzen, shipping & korting-totaal fixen

## Problemen

1. **Itemprijzen tonen €0.00** — De checkout API retourneert `price: 0` voor items. De code op regel 467 (`Number(item.price) || 0`) toont dit blindelings.
2. **Korting niet afgetrokken van totaal** — `displayTotal` (regel 219) geeft voorrang aan `checkoutData.total` uit de API, die de kortingen niet correct meeneemt. De `computedTotal` (regel 212-217) berekent dit wél goed met `subtotal + shipping - discounts`.
3. **Shipping toont "Calculated next"** — Dit is correct op stap 1, maar na kortingen toepassen (wat ook op stap 1 kan) kan het verwarrend zijn.

## Wijzigingen

| Bestand | Wat |
|---|---|
| `src/pages/Checkout.tsx` (regel 458-480) | **Item price fallback**: bij het renderen van items, als `item.price === 0`, terugvallen op de prijs uit `cartItems` op basis van matching `id` of `title` |
| `src/pages/Checkout.tsx` (regel 219) | **displayTotal verwijderen**: altijd `computedTotal` gebruiken. Deze berekent correct `subtotal + shipping - totalDiscountAmount` |
| `src/pages/Checkout.tsx` (regel 418-422) | **handleApplyDiscount**: bij het toevoegen van een korting, `total` NIET meer overschrijven vanuit de API response. Alleen `discounts` array updaten — `computedTotal` doet de rest |
| `src/pages/Checkout.tsx` (regel 438-442) | **handleRemoveDiscount**: idem, `total` niet overschrijven maar laten berekenen door `computedTotal` |

### Samengevat
- Items tonen de juiste prijs (fallback naar cart)
- Totaal wordt altijd berekend als `subtotal + shipping - sum(discounts)` 
- Geen afhankelijkheid meer van de (foutieve) API-total

