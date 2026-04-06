

# QR Betaling Tusschenpagina

## Wat verandert

In plaats van direct naar `/checkout/success` te navigeren na QR-betaling, komt er een dedicated tusschenpagina `/checkout/qr-betaling` met een grote EPC QR-code, instructies en bankgegevens als fallback. De gebruiker klikt "Ik heb betaald" om naar de bedankt-pagina te gaan.

## Wijzigingen

### 1. `src/pages/QRPayment.tsx` — Nieuw bestand

Dedicated QR-betaalpagina met:
- Grote EPC QR-code gegenereerd uit `qrData.payload` via de `qrcode` npm-package (canvas-based)
- Fallback: als er een `image_url` is, toon die als de package-generated QR faalt
- Bestelnummer en bedrag prominent weergegeven
- Stap-voor-stap instructies (open bankapp → scan QR → bevestig betaling)
- Bankgegevens als fallback sectie (IBAN, rekeninghouder, mededeling)
- "Ik heb betaald" knop → navigeert naar `/checkout/success` met dezelfde state (paymentType: 'qr')
- Layout wrapper voor consistente styling
- Redirect naar `/` als er geen state is (directe URL-toegang)

### 2. `src/pages/Checkout.tsx` — regel 369-380

Wijzig de `case 'qr'` navigate van `/checkout/success` naar `/checkout/qr-betaling` en voeg `bankDetails` toe aan de state:

```typescript
case 'qr':
  clearCart();
  navigate('/checkout/qr-betaling', {
    state: {
      orderNumber: result.order_number,
      total: result.total,
      currency: result.currency,
      qrData: result.qr_data,
      bankDetails: result.bank_details,
      paymentType: 'qr',
    },
  });
  break;
```

### 3. `src/App.tsx` — Nieuwe route

Voeg toe: `<Route path="/checkout/qr-betaling" element={<QRPayment />} />`

### 4. Package installatie

Installeer `qrcode` npm-package voor client-side EPC QR-code generatie uit de payload string.

## Vier bestanden, één nieuw component, één npm package

