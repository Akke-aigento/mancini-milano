

# Fix: Bankgegevens Correct Doorsturen naar QR Pagina

## Analyse

De hele keten is gecontroleerd. **De data-doorgifte is correct** — `Checkout.tsx` stuurt `qrData` en `bankDetails` mee (regel 376-377), en `QRPayment.tsx` leest ze uit (regel 14-21).

Er zijn twee kleine problemen:

### Probleem 1: Type mismatch voor `bankDetails`

De API stuurt `reference` als veld, maar `QRPayment.tsx` verwacht `bic` in het type (regel 19). Het veld `reference` wordt niet getoond — de mededeling wordt nu handmatig uit `state.orderNumber` gelezen (regel 130), wat toevallig werkt. Maar voor correctheid moet het type `reference` bevatten.

### Probleem 2: Geen debug logging

Er is geen `console.log` om te zien wat er binnenkomt op de QR pagina.

## Wijzigingen

### `src/pages/QRPayment.tsx`

1. **Type aanpassen** — voeg `reference` toe aan `bankDetails` type:
   ```typescript
   bankDetails?: { iban?: string; account_holder?: string; bic?: string; reference?: string };
   ```

2. **Debug log toevoegen** — tijdelijke `useEffect` met `console.log` van alle state velden

3. **Mededeling uit `bankDetails.reference` lezen** — gebruik `state.bankDetails.reference || state.orderNumber` als mededeling (regel 130)

### Eén bestand

