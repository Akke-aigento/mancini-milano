

# Fix: Kortingscodes werken niet — case-sensitivity bug

## Oorzaak
De **edge function logs** bewijzen het definitief:

```
cart_apply_discount params={"cart_id":"...","code":"freeship"}  → 500
cart_apply_discount params={"cart_id":"...","code":"test99"}    → 500
```

De codes worden **lowercase** naar de SellQo backend gestuurd. De backend doet een exacte match: `.eq('code', code)`. Maar codes worden in de database **UPPERCASE** opgeslagen (het admin-dashboard forceert `toUpperCase()`).

In `Checkout.tsx` regel 463 wordt `code` correct naar uppercase geconverteerd, maar op **regel 471** wordt `discountInput.trim()` (de originele, lowercase waarde) doorgegeven aan de API:

```typescript
const code = discountInput.trim().toUpperCase();  // ← correct
// ...
const cartRes = await cartAPI.applyDiscount(cartId, discountInput.trim());  // ← BUG: lowercase!
```

Hetzelfde op regel 482 voor `checkoutAPI.applyDiscount`.

## Oplossing

Alle plekken waar `discountInput.trim()` naar een API gaat, vervangen door `code` (de uppercase variant):

| Regel | Huidig | Nieuw |
|---|---|---|
| 471 | `cartAPI.applyDiscount(cartId, discountInput.trim())` | `cartAPI.applyDiscount(cartId, code)` |
| 482 | `checkoutAPI.applyDiscount(cartId, discountInput.trim())` | `checkoutAPI.applyDiscount(cartId, code)` |
| 489 | `const appliedCode = discountInput.trim();` | `const appliedCode = code;` |

## Extra: meerdere codes ondersteunen

De SellQo backend ondersteunt slechts **één `discount_code` veld per cart** (kolom `storefront_carts.discount_code`). Het `checkoutApplyDiscount` endpoint overschrijft simpelweg de vorige code. Om meerdere codes te combineren zijn er twee opties:

1. **Frontend-side**: Na elke code-wijziging de backend aanroepen met de "nieuwe" code. Elke volgende code overschrijft de vorige. Dit is technisch een beperking van de backend — slechts één code tegelijk.

2. **Backend-uitbreiding** (in Sellqo project): het `discount_code` veld omzetten naar een array of een aparte koppeltabel.

Aangezien de backend nu alleen één code tegelijk ondersteunt, zou ik in deze storefront:
- Wél meerdere codes als tags tonen (UI)
- Maar bij elke nieuwe code de backend aanroepen met die ene code (de "meest recente")
- Bij verwijderen: als er nog een andere code overblijft, die opnieuw toepassen; als er geen overblijft, discount verwijderen

Dit is een tijdelijke workaround. Voor echte meervoudige ondersteuning moet de backend worden uitgebreid.

## Bestanden

| Bestand | Wijziging |
|---|---|
| `src/pages/Checkout.tsx` | `discountInput.trim()` → `code` op 3 plekken (regels 471, 482, 489) |
| `src/pages/Checkout.tsx` | Multi-code handling: bij remove, vorige code opnieuw toepassen |

## Resultaat
- Codes worden altijd uppercase naar de API gestuurd
- Geen 500-fouten meer van "Ongeldige kortingscode"
- Subtotal, shipping en total worden correct bijgewerkt na succesvolle apply

