

# Checkout Refactor: SellQo Storefront API v2 Flow

De huidige checkout gebruikt een ander API-patroon (placeOrder, shipping-options, payment-methods). De nieuwe SellQo checkout guide beschrijft een step-by-step flow met `checkout/start` → `checkout/customer` → `checkout/address` → `checkout/shipping` → `checkout/complete`. Dit vereist een volledige refactor.

## Wat verandert

### 1. Proxy Edge Function — Nieuwe checkout routes
**`supabase/functions/sellqo-proxy/index.ts`** (regels 94-111)

Nieuwe action mappings toevoegen:
- `POST /checkout/start` → `checkout_start`
- `POST /checkout/customer` → `checkout_customer`
- `POST /checkout/address` → `checkout_address`
- `POST /checkout/shipping` → `checkout_shipping`
- `POST /checkout/complete` → `checkout_complete`
- `POST /checkout/discount` → `checkout_apply_discount`
- `DELETE /checkout/discount` → `checkout_remove_discount`

Oude routes (`shipping-options`, `payment-methods`, `place-order`) worden verwijderd.

### 2. API Layer
**`src/integrations/sellqo/api.ts`** — `checkoutAPI` object volledig herschrijven:

```typescript
checkoutAPI = {
  start: (cart_id) => POST /checkout/start { cart_id }
  saveCustomer: (order_id, customer) => POST /checkout/customer { order_id, customer }
  saveAddress: (order_id, shipping_address, billing_same, billing_address?) => POST /checkout/address
  selectShipping: (order_id, shipping_method_id) => POST /checkout/shipping
  complete: (order_id, payment_method_id, success_url, cancel_url) => POST /checkout/complete
  applyDiscount: (order_id, discount_code) => POST /checkout/discount
  removeDiscount: (order_id) => DELETE /checkout/discount
}
```

### 3. Checkout Page — Volledige herschrijving
**`src/pages/Checkout.tsx`**

**Stappen worden:**
1. **Gegevens** — naam, email, telefoon
2. **Adres** — verzendadres + billing toggle
3. **Verzending** — conditioneel (skip als geen methodes, auto-select als 1)
4. **Betaling** — methode kiezen + "Bestelling plaatsen"

**Flow:**
- Bij laden: roep `checkout/start` aan met cart_id → krijg `order_id` + `available_payment_methods` + `available_shipping_methods` + items
- Sla checkout state op in useState (order_id, available methods, totalen)
- Elke stap roept de bijbehorende API aan
- Bij `complete`: handle `payment_type` (redirect → Stripe, manual → bedankt met bankgegevens, qr → bedankt met QR)

**Order samenvatting sidebar:**
- Desktop: naast de stappen
- Mobiel: boven de stappen (of in collapsible)
- Toont items, subtotaal, verzending, korting, totaal
- Kortingscode invoerveld

### 4. Bedankt Pagina — 3 Varianten
**`src/pages/CheckoutSuccess.tsx`**

- **Stripe**: klant komt terug met `session_id` query param → toon "Betaling ontvangen"
- **Bankoverschrijving**: data via `navigate state` → toon IBAN, rekeninghouder, referentie
- **QR**: data via `navigate state` → toon QR code + bedrag
- Cart leeggooien bij alle varianten

### 5. Route aanpassing
**`src/App.tsx`** — `/checkout/success` route blijft, geen wijziging nodig

## Bestanden

| Bestand | Actie |
|---|---|
| `supabase/functions/sellqo-proxy/index.ts` | Checkout routes updaten |
| `src/integrations/sellqo/api.ts` | checkoutAPI herschrijven |
| `src/pages/Checkout.tsx` | Volledige herschrijving (4-stap flow) |
| `src/pages/CheckoutSuccess.tsx` | 3 varianten (Stripe/bank/QR) |

