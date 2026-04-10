

# Kortingscode bugs fixen: winkelmandje & checkout

## Probleem 1: Winkelmandje – korting wordt geaccepteerd maar niet verrekend
De `useApplyDiscount` hook in `hooks.ts` mist een `onSettled` stap die de cart-query invalideert. Andere mutaties (update, remove) doen dit wel. Hierdoor wordt de cart-data niet opnieuw opgehaald na het toepassen van een korting, en zie je het bedrag niet veranderen.

## Probleem 2: Checkout – inputveld verliest focus na elke toets
De `OrderSummary` component (met daarin het discount-inputveld) is gedefinieerd als een **functie binnen** de `Checkout` component (regel 452). Hierdoor wordt het component bij elke state-wijziging opnieuw aangemaakt door React, waardoor het inputveld telkens opnieuw gemount wordt en je focus verliest.

## Wijzigingen

| Bestand | Wat |
|---|---|
| `src/integrations/sellqo/hooks.ts` (regels 263-276) | `onSettled` toevoegen aan `useApplyDiscount` die `sellqoKeys.cart(cartId)` invalideert, net als bij de andere cart-mutaties |
| `src/pages/Checkout.tsx` (regel 452) | `OrderSummary` van een geneste functie-component omzetten naar inline JSX, of verplaatsen naar buiten de Checkout component met props |

