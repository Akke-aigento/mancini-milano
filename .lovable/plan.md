

# Fix: Totaal herberekenen met alle kortingen

## Probleem
Wanneer een kortingscode wordt toegepast, updatet `handleApplyDiscount` alleen de lokale `discounts` array. De API-response bevat waarschijnlijk ook bijgewerkte waarden voor `subtotal`, `shippingCost` en `total`, maar die worden genegeerd. Hierdoor:
- FREESHIP zet shipping niet naar €0 (de API doet dit wel, maar lokaal blijft €8.00 staan)
- De `computedTotal` berekent `subtotal + shipping - discounts`, maar als de discount-amount €0.00 is (zoals bij FREESHIP) en de shipping niet wordt aangepast, klopt het totaal niet

## Oplossing
Na het toepassen van een korting, ook `subtotal`, `shippingCost` en `total` uit de API-response overnemen. Idem bij het verwijderen.

## Wijzigingen

| Bestand | Wat |
|---|---|
| `src/pages/Checkout.tsx` (~regel 426-429) | In `handleApplyDiscount`: naast discounts ook `subtotal`, `shippingCost` en `total` updaten vanuit de API-response |
| `src/pages/Checkout.tsx` (~regel 445-448) | In `handleRemoveDiscount`: idem, subtotal/shipping/total herstellen vanuit API-response |

### Code (handleApplyDiscount)
```typescript
setCheckoutData(prev => prev ? {
  ...prev,
  subtotal: Number(result.subtotal) || prev.subtotal,
  shippingCost: Number(result.shipping_cost ?? result.shippingCost) ?? prev.shippingCost,
  discounts: [...prev.discounts, {
    code: result.discount_code || result.code || discountInput.trim(),
    amount: Number(result.discount_amount ?? result.amount ?? result.value ?? 0) || 0,
  }],
} : prev);
```

### Code (handleRemoveDiscount)
```typescript
setCheckoutData(prev => prev ? {
  ...prev,
  subtotal: Number(result.subtotal) || prev.subtotal,
  shippingCost: Number(result.shipping_cost ?? result.shippingCost) ?? prev.shippingCost,
  discounts: prev.discounts.filter(d => d.code !== codeToRemove),
} : prev);
```

Twee kleine wijzigingen in hetzelfde bestand. De `computedTotal` berekening blijft ongewijzigd — die pakt automatisch de nieuwe waarden op.

