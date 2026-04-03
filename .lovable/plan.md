

# Checkout Fix: order_id → cart_id + Stripe Success URL + Discount UI

## Wat verandert

De API wordt aangepast zodat alle checkout-stappen `cart_id` gebruiken in plaats van `order_id`. Daarnaast: Stripe success URL met `{CHECKOUT_SESSION_ID}`, cart cleanup timing fix, en order polling op de bedankt-pagina.

## Wijzigingen

### 1. `src/integrations/sellqo/api.ts` — checkoutAPI

Alle functies die `order_id` als parameter nemen worden omgezet naar `cart_id`:

- `saveCustomer(cart_id, customer)` → body: `{ cart_id, customer }`
- `saveAddress(cart_id, data)` → body: `{ cart_id, ...data }`
- `selectShipping(cart_id, shipping_method_id)` → body: `{ cart_id, shipping_method_id }`
- `complete(cart_id, payment_method_id, success_url, cancel_url)` → body: `{ cart_id, ... }`
- `applyDiscount(cart_id, discount_code)` → body: `{ cart_id, discount_code }`
- `removeDiscount(cart_id)` → body: `{ cart_id }`

Voeg toe: `getOrderBySession(stripe_session_id)` → GET `/checkout/order?stripe_session_id=...`

### 2. `src/pages/Checkout.tsx`

- Verwijder `orderId` uit CheckoutData interface (niet meer nodig)
- Gebruik `cartId` (uit localStorage) direct in alle API calls in plaats van `checkoutData.orderId`
- `handleCompleteOrder`: verwijder `clearCart()` voor Stripe redirect (cart wordt pas op bedankt-pagina geleegd)
- Success URL wijzigen: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}` (Stripe vervangt de placeholder)
- Behoud `clearCart()` voor manual/qr flows

### 3. `src/pages/CheckoutSuccess.tsx`

- Bij Stripe redirect (session_id in URL): poll `/checkout/order?stripe_session_id=...` met max 5 pogingen (2s interval)
- Na succesvolle poll: toon ordernummer + clearCart
- Na 5 mislukte pogingen: toon generiek bedankt-bericht + clearCart
- Bestaande manual/qr/fallback logica blijft ongewijzigd

## Drie bestanden

