

# Shipping direct berekenen bij checkout init

## Probleem
Shipping toont "Calculated next" op stap 1, terwijl de gebruiker daar al zijn verzendgegevens invult. De `selectShipping` API-call wordt pas gedaan bij het doorsturen naar de volgende stap.

## Wijziging

| Bestand | Wat |
|---|---|
| `src/pages/Checkout.tsx` (regels 118-159) | Na het initialiseren van de checkout en het selecteren van de eerste shipping method, direct `checkoutAPI.selectShipping()` aanroepen om de shippingkosten op te halen en in `checkoutData.shippingCost` te zetten |
| `src/pages/Checkout.tsx` (regel 523) | Shipping-tekst aanpassen: als `shippingCost === 0` en er een shipping method is geselecteerd, toon "Free" i.p.v. "Calculated next" |

### Technisch
In `initCheckout`, na regel 144 (`setSelectedShipping`), direct:
```typescript
const shipRes = await checkoutAPI.selectShipping(cartId, result.available_shipping_methods[0].id);
const shipResult = shipRes?.data || shipRes;
// shippingCost meteen setten in checkoutData
```

De "Calculated next" tekst wordt dan enkel nog getoond als er nog geen shipping method beschikbaar is (edge case).

