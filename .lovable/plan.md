

# Complete Checkout Flow — Multi-Step met Stripe & Bankoverschrijving

## Probleem

De huidige "Checkout" knop in de cart roept `checkout_start` aan, maar die retourneert alleen een cart-samenvatting — geen `checkout_url`. De SellQo API vereist een multi-step flow:

1. `checkout_start` → cart summary
2. `checkout_get_shipping_options` → verzendmethoden + prijzen
3. `checkout_get_payment_methods` → Stripe / bankoverschrijving
4. `checkout_place_order` → maakt order aan, decrement stock, retourneert `payment_url` (Stripe) of order-bevestiging (bank)

## Wat wordt gebouwd

### Nieuwe Checkout pagina (`src/pages/Checkout.tsx`)

Een multi-step formulier:

**Stap 1 — Adres & Contact:** Voornaam, achternaam, email, telefoon, straat, huisnummer, postcode, stad, land. Pre-filled vanuit account als ingelogd (via `customer.addresses[0]`).

**Stap 2 — Verzendmethode:** Opgehaald via `checkout_get_shipping_options`. Radio buttons met naam + prijs (of "Free" boven drempel).

**Stap 3 — Betaalmethode:** Opgehaald via `checkout_get_payment_methods`. Toont beschikbare opties (Stripe online, bankoverschrijving).

**Stap 4 — Overzicht & Plaatsen:** Samenvatting van items, adres, verzending, totaal. "Place Order" knop roept `checkout_place_order` aan. Bij Stripe → redirect naar `payment_url`. Bij bank → toon bevestiging met bankgegevens.

### Proxy updates (`supabase/functions/sellqo-proxy/index.ts`)

Nieuwe route-mappings toevoegen in `resolveAction`:

- `POST /checkout/shipping-options` → `checkout_get_shipping_options`
- `POST /checkout/payment-methods` → `checkout_get_payment_methods`
- `POST /checkout/place-order` → `checkout_place_order`
- `GET /checkout/confirmation/:id` → `checkout_get_confirmation`

Plus `origin` meesturen zodat Stripe redirect URLs naar Mancini's domein wijzen.

### API client updates (`src/integrations/sellqo/api.ts`)

Nieuwe functies:
```typescript
checkoutAPI.getShippingOptions(cartId, country, subtotal)
checkoutAPI.getPaymentMethods()
checkoutAPI.placeOrder({ cart_id, shipping_address, email, phone, shipping_method_id, payment_method, origin })
checkoutAPI.getConfirmation(orderId)
```

### Cart pagina update (`src/pages/Cart.tsx`)

"Checkout" knop navigeert naar `/checkout` in plaats van de gebroken `checkout()` functie aan te roepen.

### CartDrawer update (`src/components/CartDrawer.tsx`)

Zelfde fix: checkout knop linkt naar `/checkout`.

### CheckoutSuccess update (`src/pages/CheckoutSuccess.tsx`)

Accepteert `order_id` query param, haalt orderbevestiging op via `checkout_get_confirmation`, toont ordernummer.

### Route registratie (`src/App.tsx`)

Voeg `/checkout` en `/order-confirmation` routes toe.

## Technische details

- `checkout_place_order` verwacht `origin` param voor Stripe success/cancel URLs
- Stripe maakt een Connect checkout session met de tenant's connected account
- Bij succesvolle Stripe betaling redirect naar `/order-confirmation?order_id=xxx`
- Bij bankoverschrijving wordt direct de bevestigingspagina getoond
- Na order: localStorage cart ID wordt gewist

## Files

| File | Wijziging |
|------|-----------|
| `supabase/functions/sellqo-proxy/index.ts` | Checkout sub-routes toevoegen |
| `src/integrations/sellqo/api.ts` | Checkout API functies |
| `src/pages/Checkout.tsx` | Nieuw — multi-step checkout |
| `src/pages/Cart.tsx` | Navigate naar `/checkout` |
| `src/components/CartDrawer.tsx` | Navigate naar `/checkout` |
| `src/pages/CheckoutSuccess.tsx` | Order confirmatie ophalen |
| `src/App.tsx` | Routes toevoegen |

