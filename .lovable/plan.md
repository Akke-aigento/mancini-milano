

# Fix: Korting toont -€NaN

## Oorzaak
In `handleApplyDiscount` (regel 428) worden `result.discount_code` en `result.discount_amount` uit de API-response gehaald. Als de API deze velden anders noemt (bijv. `code`, `amount`, of genest in een ander object), wordt `undefined` opgeslagen. `formatPrice(undefined)` geeft dan `-€NaN`.

## Wijziging

| Bestand | Wat |
|---|---|
| `src/pages/Checkout.tsx` (regel 428) | Fallback-extractie toevoegen voor het discount bedrag en code: `result.discount_amount || result.amount || result.value || 0` en `result.discount_code || result.code || discountInput.trim()`. Dit vangt alle mogelijke API-response-formaten op en voorkomt `NaN`. |

### Code
```typescript
discounts: [...prev.discounts, {
  code: result.discount_code || result.code || discountInput.trim(),
  amount: Number(result.discount_amount ?? result.amount ?? result.value ?? 0) || 0,
}],
```

Eén regel wijzigen, geen andere bestanden nodig.

