

# Fix: Meerdere kortingscodes & prijsberekening — Backend + Frontend

## Probleem
Er zijn **twee** problemen:

### 1. Backend: slechts 1 discount_code per cart
`storefront_carts.discount_code` is een enkele `text` kolom. Elke nieuwe code overschrijft de vorige. TEST99 + FREESHIP tegelijk is onmogelijk.

### 2. Backend: checkoutShipping negeert free_shipping van kortingscode
Wanneer FREESHIP wordt toegepast, zet `checkoutApplyDiscount` correct `shipping_cost: 0` op de cart. Maar daarna roept de frontend `refreshCheckoutPricing` aan, die `checkoutShipping` triggert. Die functie (regel 1611) berekent shipping puur op basis van `free_above` — en negeert compleet dat er een free_shipping kortingscode actief is. Resultaat: shipping wordt weer €8.

## Aanpak: wijzigingen in Sellqo project

### A. Meerdere discount codes ondersteunen

**Database migratie:**
- `storefront_carts.discount_code` (text) → `discount_codes` (text[] array)
- `storefront_carts.discount_amount` blijft (som van alle kortingen)

**Edge function (`storefront-api/index.ts`):**
- `cartApplyDiscount`: code toevoegen aan array i.p.v. overschrijven
- `cartRemoveDiscount`: specifieke code uit array verwijderen (nieuwe param `code`)
- `checkoutApplyDiscount`: idem — code toevoegen aan array, alle codes herberekenen
- `checkoutRemoveDiscount`: specifieke code verwijderen, herberekenen
- `checkoutStart`: discount_codes array meegeven in response
- `createOrderFromCart`: alle codes opslaan (bv. comma-separated in `orders.discount_code`)

### B. checkoutShipping: free_shipping respecteren

In `checkoutShipping` (regel 1611):
```text
Huidig:  shippingCost = free_above check only
Nieuw:   als cart.discount_codes een free_shipping code bevat → shippingCost = 0
         anders: normale free_above logica
```

### C. Frontend (dit project)

Na backend-fix:
- `handleApplyDiscount`: vertrouw op `checkoutApplyDiscount` response voor alle pricing (subtotal, shipping_cost, total, discount_amount)
- Stop met `refreshCheckoutPricing` na apply — de response heeft al alles
- `handleRemoveDiscount`: stuur specifieke code mee naar remove endpoint
- Toon discount tags op basis van server-returned `discount_codes` array

## Bestanden

| Project | Bestand | Wijziging |
|---|---|---|
| **Sellqo** | `supabase/functions/storefront-api/index.ts` | `cartApplyDiscount`, `cartRemoveDiscount`, `checkoutApplyDiscount`, `checkoutRemoveDiscount`, `checkoutShipping`, `checkoutStart`, `createOrderFromCart` aanpassen voor multi-code + free_shipping check |
| **Sellqo** | Nieuwe migratie | `discount_code text` → `discount_codes text[]` |
| **Mancini** | `src/pages/Checkout.tsx` | Pricing direct uit applyDiscount response gebruiken, geen refreshCheckoutPricing meer na discount, remove met specifieke code |

## Volgorde
1. Eerst Sellqo backend aanpassen (migratie + edge function)
2. Dan Mancini frontend aanpassen

Zal ik beginnen met de Sellqo backend?

