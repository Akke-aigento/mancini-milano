

# Fix: Korting wordt niet van totaal afgetrokken

## Oorzaak
De `checkout_apply_discount` API geeft waarschijnlijk alleen discount-info terug (code, bedrag), maar **niet** de bijgewerkte `total`, `subtotal` of `shipping_cost`. Daardoor valt `toFiniteNumber(result.total, prev.total)` terug op de **oude** total — en verandert er niks.

## Oplossing
Na elke apply/remove van een kortingscode: **opnieuw `checkoutAPI.start(cartId)` aanroepen** om de volledige, correcte pricing op te halen. Dit is de enige manier om gegarandeerd de juiste totalen te krijgen, ongeacht wat de discount-endpoint teruggeeft.

## Wijzigingen

| Bestand | Wat |
|---|---|
| `src/pages/Checkout.tsx` | Extracteer de init-logica (die `checkoutAPI.start` + auto-shipping doet) naar een herbruikbare `refreshCheckoutPricing(cartId)` functie |
| `src/pages/Checkout.tsx` | In `handleApplyDiscount`: na succesvolle apply, roep `refreshCheckoutPricing` aan — die haalt subtotal, shipping en total vers op van de server |
| `src/pages/Checkout.tsx` | In `handleRemoveDiscount`: idem, na succesvolle remove, roep `refreshCheckoutPricing` aan |
| `src/pages/Checkout.tsx` | Discount-codes blijven lokaal bijgehouden als UI-lijst (voor de tags), maar **alle bedragen** komen uit de verse `start`-response |

### Concreet
```typescript
const refreshCheckoutPricing = async (cartId: string) => {
  const res = await checkoutAPI.start(cartId);
  const result = (res as any)?.data || res;
  setCheckoutData(prev => prev ? {
    ...prev,
    subtotal: toFiniteNumber(result.subtotal, prev.subtotal),
    total: toFiniteNumber(result.total, prev.total),
    shippingCost: toFiniteNumber(result.shipping_cost, prev.shippingCost),
  } : prev);
  // Re-select shipping als die er is
  if (selectedShipping) {
    const shipRes = await checkoutAPI.selectShipping(cartId, selectedShipping);
    const shipResult = (shipRes as any)?.data || shipRes;
    setCheckoutData(prev => prev ? {
      ...prev,
      shippingCost: toFiniteNumber(shipResult.shipping_cost, prev.shippingCost),
      total: toFiniteNumber(shipResult.total, prev.total),
    } : prev);
  }
};
```

In `handleApplyDiscount`, na de succesvolle discount call:
```typescript
// Voeg code toe aan lokale lijst
setCheckoutData(prev => prev ? {
  ...prev,
  discounts: [...prev.discounts, { code: ..., amount: 0 }],
} : prev);
// Haal verse totalen op
await refreshCheckoutPricing(cartId);
```

Idem in `handleRemoveDiscount`.

### Resultaat
- Total, subtotal en shipping komen altijd van de server
- Geen lokale rekenlogica meer
- Werkt ongeacht wat de discount-endpoint teruggeeft
- Combinatie van codes (TEST99 + FREESHIP) werkt correct

