

# Meerdere kortingscodes ondersteunen op checkout

## Probleem
De checkout slaat momenteel slechts één kortingscode op (`discount: { code, amount } | null`). Bij het toepassen van een tweede code wordt de eerste overschreven. Kortingscodes zijn combineerbaar en moeten gestapeld zichtbaar zijn.

## Wijzigingen

| Bestand | Wat |
|---|---|
| `src/pages/Checkout.tsx` | 1. `discount` type wijzigen van `{ code; amount } | null` naar `{ code; amount }[]` (array) |
| | 2. `handleApplyDiscount`: nieuwe code toevoegen aan de array i.p.v. overschrijven |
| | 3. `handleRemoveDiscount`: accepteert een `code` parameter om één specifieke korting te verwijderen |
| | 4. `removeDiscount` API-call aanpassen: `discount_code` meesturen zodat de backend weet welke te verwijderen |
| | 5. Computed total: som van alle `discount[].amount` aftrekken |
| | 6. UI: alle kortingen als gestapelde rijen tonen, elk met eigen verwijder-knopje |
| `src/integrations/sellqo/api.ts` | `removeDiscount` uitbreiden met optionele `discount_code` parameter |

### UI voorbeeld
```text
┌─────────────────────────────────┐
│  [Discount code     ] [APPLY]   │
│  🏷 FREESHIP          -€0.00  ✕ │
│  🏷 TEST99           -€59.39  ✕ │
│  Subtotal              €59.99   │
│  Shipping        Calculated...  │
│  ──────────────────────────────  │
│  Total                  €0.60   │
└─────────────────────────────────┘
```

