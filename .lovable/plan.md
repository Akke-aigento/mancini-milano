
Doel: dit niet nog eens “patchen”, maar de discount-flow terugbrengen naar één bewezen bron van waarheid.

## Waarschijnlijk echte oorzaak
Op basis van de code en je screenshot gaat het nu op een fundamenteler punt fout:
- `Checkout.tsx` gebruikt voor kortingscodes **`checkoutAPI.applyDiscount`**
- de rest van de shop heeft al een bestaande, gesynchroniseerde discount-flow via de **cart API / hooks**
- de checkout voegt de code **optimistisch lokaal** toe aan `checkoutData.discounts`
- daarna wordt alleen geprobeerd pricing te “refreshen”, maar er is nergens bewijs dat de gebruikte checkout-discount endpoint de onderliggende cart/pricing echt wijzigt

Gevolg:
- code verschijnt in de UI
- toast zegt “success”
- maar subtotal/shipping/total blijven feitelijk onveranderd

De bug is dus niet alleen “herberekenen”, maar vooral: **de verkeerde state/endpoint wordt vertrouwd**.

## Permanente aanpak
Ik zou dit corrigeren in 3 vaste stappen:

### 1. Discount-actie terug naar de echte prijsbron
In `src/pages/Checkout.tsx`:
- kortingscodes niet langer primair via de huidige lokale checkout-state afhandelen
- de actie koppelen aan de bestaande discount-flow die ook de cart-prijzen synchroniseert
- in default mode verifiëren welke endpoint de backend echt muteert:
  - als `cart_apply_discount` de echte prijswijziging doet: checkout daarop laten steunen
  - alleen als live inspectie bewijst dat `checkout_apply_discount` wél de prijs muteert, die blijven gebruiken

Belangrijk: de UI mag pas “applied” tonen als de serverprijs ook echt veranderd of de server de code expliciet bevestigt.

### 2. Sidebar volledig server-gedreven maken
In `src/pages/Checkout.tsx`:
- na apply/remove altijd een **volledige server refresh** doen van:
  - cart state
  - checkout start
  - selected shipping
- `subtotal`, `shippingCost`, `total` uitsluitend uit die bevestigde serverresponses tonen
- geen optimistic discount-tag meer zonder serverbevestiging

### 3. Discountlijst alleen tonen als bevestigd
Nu wordt de lijst lokaal opgebouwd en kan die losstaan van de echte prijs.
Dat moet worden vervangen door:
- óf een backend-returned discounts array
- óf een bevestigde lokale lijst die alleen wordt geüpdatet nadat de refresh laat zien dat de code echt actief is

Als de backend géén bruikbare discounts-array terugstuurt:
- code pas in de lijst zetten na succesvolle refresh
- als totals/shipping ongewijzigd blijven en de code niet bevestigd wordt: geen success-toast, maar foutmelding

## Bestanden
- `src/pages/Checkout.tsx`
  - discount apply/remove flow herschrijven
  - optimistic local tagging verwijderen
  - één server-refresh pad gebruiken
  - sidebar alleen uit confirmed pricing voeden
- `src/integrations/sellqo/api.ts`
  - response types verruimen voor confirmed discount data / arrays indien aanwezig
- `src/integrations/sellqo/normalizer.ts`
  - indien cart-response meerdere discountvelden teruggeeft: correct normaliseren
- eventueel `src/integrations/sellqo/hooks.ts`
  - bestaande cart discount mutation hergebruiken in plaats van een losse checkout-specifieke flow

## Implementatiebeslissing
Ik ga dit niet meer oplossen met nog een extra `setCheckoutData(...)` patch.
De juiste fix is:
```text
apply/remove code
-> server muteert echte prijsbron
-> volledige refresh
-> alleen confirmed totals + confirmed codes renderen
```

## Validatie na implementatie
Ik zou daarna expliciet deze flow nalopen:
1. zonder korting
2. alleen `TEST99`
3. alleen `FREESHIP`
4. `TEST99` + `FREESHIP`
5. verwijderen in beide volgordes
6. controleren dat:
   - tag zichtbaar is
   - subtotal correct daalt bij normale korting
   - shipping op Free gaat bij freeship
   - total exact overeenkomt met server
   - geen success-toast verschijnt als de prijs feitelijk niet verandert

## Waarom dit permanent is
Dan bestaat er nog maar één waarheid:
- niet “code staat in UI dus het zal wel goed zijn”
- maar “server bevestigt prijs, en precies die prijs tonen we”

Dat voorkomt precies wat je nu ziet: zichtbare code, maar geen echte korting.
