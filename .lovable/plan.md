

# Fix: 3 Checkout Bugs

## Bug 1: "Bankoverschrijving" hernoemen naar "QR code met je bankapp"

In `src/pages/Checkout.tsx` wordt `bank_transfer` momenteel niet apart gelabeld — alleen `qr_transfer` krijgt een custom label (regel 775). Ik voeg ook `bank_transfer` toe aan de custom label logica zodat **beide** worden getoond als "QR code met je bankapp" (of als er apart een bank_transfer is, krijgt die ook het juiste label).

**Locatie**: regels 753-793 — in de payment method rendering, voeg `bank_transfer` toe aan de `isQr` check:
```
const isQr = methodId === 'qr_transfer' || methodId === 'bank_transfer';
```

## Bug 2: Winkelmandje badge niet leeg na bestelling

**Oorzaak**: `clearCart()` in CartContext (regel 88-90) verwijdert alleen `mancini_cart_id` uit localStorage, maar reset NIET de React Query cache. De `useCartQuery` hook blijft de oude data tonen in de badge.

**Fix in `src/integrations/sellqo/CartContext.tsx`**:
- Import `useQueryClient` van `@tanstack/react-query`
- In `clearCart()`: naast `localStorage.removeItem`, ook `queryClient.setQueryData` voor de cart key op `undefined` en `queryClient.invalidateQueries` aanroepen

## Bug 3: QR code niet getoond op bedankt-pagina

**Analyse**: De CheckoutSuccess pagina (regel 146) controleert `paymentType === 'qr' && state?.qrData`. De checkout navigate (regel 369-379) stuurt correct `paymentType: 'qr'` en `qrData: result.qr_data`.

Mogelijke oorzaak: regel 24 bepaalt `paymentType` fallback: als `state` null is (bijv. na page refresh), valt het terug naar `'manual'` als er geen `session_id` is. Dit is correct. De QR flow zou moeten werken als de state correct wordt doorgegeven.

**Extra safeguard**: voeg `console.log` toe voor debugging en zorg dat de QR sectie ook werkt als `qr_data` onder `state.qrData` OF als genest object beschikbaar is. Voeg fallback toe voor `state?.qrData?.image_url || state?.qrData?.qr_image_url`.

## Bestanden

| Bestand | Wijziging |
|---|---|
| `src/pages/Checkout.tsx` | `bank_transfer` toevoegen aan QR label check (1 regel) |
| `src/integrations/sellqo/CartContext.tsx` | `clearCart()` uitbreiden met React Query cache reset |
| `src/pages/CheckoutSuccess.tsx` | QR data fallbacks toevoegen |

