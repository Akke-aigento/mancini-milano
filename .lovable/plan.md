

# Checkout Bugfix: 8 Fixes in 2 Bestanden

## Overzicht wijzigingen

### `src/pages/Checkout.tsx` — Volledige herschrijving checkout flow

**Bug 1: Combineer Gegevens + Adres tot 1 stap**
- Verwijder aparte `customer` en `address` stappen
- Nieuwe stappen: `details` (gegevens + adres gecombineerd) en `payment`
- Stepper toont 2 stappen: "Details & Address" en "Payment"
- Bij "Verder": stuur customer + address API calls sequentieel, dan auto-select shipping als 1 methode, ga naar payment
- Shipping stap blijft als aparte stap alleen als er >1 shipping methode is

**Bug 2: QR betaling — volgorde, naam, device filtering**
- Sorteer betaalmethodes: `qr_transfer` eerst, dan `bank_transfer`, dan `stripe`
- Hernoem QR naar "Scan QR code met je bankapp" met beschrijving "Gratis — direct betalen via je bankapp"
- Verberg QR op touch devices of schermen <1024px via `useEffect` check
- Toon "Geen transactiekosten" badge bij QR

**Bug 4: Totaal op €0.00**
- Bereken `computedTotal` als fallback: `Math.max(0, subtotal + shippingCost - discountAmount)`
- Gebruik API total als beschikbaar, anders fallback

**Bug 5: NaN in besteloverzicht**
- Fallback bij item prijs: `Number(item.price) || 0`

**Bug 6: Betaling mislukt maar toont success**
- Voeg expliciete `!result.success` check toe in `handleCompleteOrder` VOOR de switch
- Navigeer ALLEEN bij succesvolle response

**Bug 7: Stripe betaalopties badges**
- Toon onder Stripe optie: iDEAL, Bancontact, Creditcard, Apple Pay badges

**Bug 8: Kortingscode UI**
- Al aanwezig in OrderSummary — behouden en werkend

### `src/pages/CheckoutSuccess.tsx` — QR weergave fix

**Bug 3: QR code niet getoond**
- QR sectie is al correct geïmplementeerd, maar vergroot QR image naar `w-64 h-64`
- Voeg extra instructietekst toe

## Twee bestanden, geen API wijzigingen nodig

