
# Permanente fix voor checkout-totaal, shipping en kortingscodes

## Wat er fundamenteel fout zit
De checkout is nu instabiel omdat de frontend zelf prijslogica probeert te doen:
- `computedTotal = subtotal + shipping - sum(discounts)` rekent lokaal een totaal uit
- `discounts` wordt lokaal opgebouwd uit partiële API-responses
- sommige updates syncen alleen `subtotal`, andere alleen `shippingCost`
- `Number(...) || prev...` en `Number(...) ?? prev...` behandelen `0` en `NaN` fout

Daardoor krijg je precies wat op de screenshot staat: codes zichtbaar, maar bedragen `0`, shipping verandert wel, totaal niet betrouwbaar.

## Permanente aanpak
De frontend moet stoppen met business logic doen en de checkout-API als enige bron van waarheid gebruiken.

| Bestand | Wijziging |
|---|---|
| `src/pages/Checkout.tsx` | Lokale totaalberekening verwijderen: `totalDiscountAmount`, `computedTotal` en `displayTotal = computedTotal` schrappen |
| `src/pages/Checkout.tsx` | Eén centrale helper maken die elke checkout-response veilig in `checkoutData` merged: `subtotal`, `shippingCost`, `total`, `items`, beschikbare methodes en eventuele discount-data |
| `src/pages/Checkout.tsx` | `initCheckout`, `selectShipping`, `handleApplyDiscount`, `handleRemoveDiscount` en de auto-shipping flow allemaal via diezelfde helper laten lopen |
| `src/pages/Checkout.tsx` | Discount-codes alleen nog als UI-lijst bijhouden als de API geen volledige discount-array terugstuurt; bedragen niet meer gokken |
| `src/pages/Checkout.tsx` | Discount-bedrag alleen tonen als de API expliciet een geldig bedrag teruggeeft; anders wel code tonen, maar geen fake `-€0.00` |
| `src/pages/Checkout.tsx` | Overal veilige number parsing gebruiken met `Number.isFinite`, zodat `0` een geldige waarde blijft |
| `src/integrations/sellqo/api.ts` | Checkout response types verruimen zodat `subtotal`, `shipping_cost`, `total` en optionele discount-info correct getypt kunnen worden |

## Concreet gedrag na de fix
- **Subtotal** komt altijd rechtstreeks uit de API
- **Shipping** komt altijd rechtstreeks uit de API
- **Total** komt altijd rechtstreeks uit de API
- **FREESHIP** werkt doordat `shippingCost` vanuit de API naar `0` gaat
- **Combinatie van meerdere codes** werkt omdat niet meer lokaal wordt herrekend
- **0-waardes** blijven correct zichtbaar en vallen niet terug op oude waardes
- **Geen `-€0.00` of `NaN` meer** tenzij de API echt een fout antwoord geeft

## Extra robuustheid
Ik zou ook deze fout meteen meenemen:
- `subtotal: Number(result.subtotal) || prev.subtotal` is fout, want een geldige `0` wordt genegeerd
- `shippingCost: Number(result.shipping_cost ?? result.shippingCost) ?? prev.shippingCost` is ook fout, want `Number(undefined)` wordt `NaN` en `??` vangt dat niet op

Dat moet vervangen worden door één helper in deze stijl:
```ts
const toFiniteNumber = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};
```

## Technische uitwerking
1. In `Checkout.tsx` een centrale merge-functie maken voor pricing state
2. Alle checkout API-handlers daarop laten vertrouwen
3. Lokale rekenformules verwijderen
4. Discount rendering loskoppelen van totaalberekening
5. Alleen expliciete API-bedragen tonen bij kortingsregels
6. Alles testen op gecombineerde codes en removal-volgorde

## Validatie na implementatie
Deze flow moet expliciet getest worden:
1. Zonder korting
2. Alleen `TEST99`
3. Alleen `FREESHIP`
4. `TEST99` + `FREESHIP`
5. Eerst kortingscode A verwijderen, daarna B
6. Eerst B verwijderen, daarna A
7. Geval waar shipping of subtotal exact `0` wordt

Als dit zo wordt uitgevoerd, is de fix niet “nog een patch”, maar een structurele correctie: één bron van waarheid, geen dubbele rekenlogica, en geen afhankelijke state die uit sync raakt.
