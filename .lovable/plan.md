# SHIP-GEO-FE-1 — Dynamische verzendlandenlijst in de checkout

De adresstap van de checkout gebruikt nu een vaste lijst van tien landen. Die lijst
verdwijnt: de winkel bepaalt zelf naar welke landen verzonden wordt, en de dropdown
toont uitsluitend die landen.

## Wat de klant merkt

- De landenkeuze toont enkel landen waar echt naar verzonden wordt.
- Is er precies één toegestaan land, dan staat er geen keuzelijst maar een vaste
  regel met dat land (leest als bevestiging).
- Verzendt de winkel tijdelijk nergens naartoe, dan komt er een melding
  "Deze winkel verzendt momenteel niet" en is doorgaan naar betaling niet mogelijk.
- Landnamen staan in de taal van de bezoeker (Nederlands als terugvaloptie),
  alfabetisch gesorteerd op die naam.
- Stond er nog een niet-toegestaan land opgeslagen (bijvoorbeeld uit een eerder
  account-adres), dan wordt dat automatisch gecorrigeerd naar het standaardland.

## Technische uitvoering

**1. API-call (`src/integrations/sellqo/api.ts`)**

Nieuw: `shippingAPI.getCountries()` → `sellqoFetch('/get_shipping_countries', { method: 'POST', body: '{}' })`.
De proxy heeft geen wijziging nodig: de fallback in `resolveAction` doet
`segments.join('_')`, dus het pad met underscores mapt exact op action
`get_shipping_countries` met de tenant-id uit de header. Geen streepjes gebruiken.

Responsevorm: `{ countries: string[], unrestricted: boolean, default_country: string | null }`,
gelezen via de bestaande `extractSingle`/plat-object-tolerantie.

**2. Hook (`src/integrations/sellqo/hooks.ts`)**

`useShippingCountries()` op react-query, `staleTime: 5 * 60 * 1000`, geen cart-afhankelijkheid.

**3. Landnaam-helper (nieuw bestand `src/lib/countries.ts`)**

- `localizedCountryName(code, locale)` via `Intl.DisplayNames(locale, { type: 'region' })`
  met `try/catch` en `nl` als fallback, en de ISO-code zelf als laatste redmiddel.
- `localizedCountryOptions(codes, locale)` → `{ code, name }[]` gesorteerd op naam
  met `localeCompare`.
- `FALLBACK_COUNTRY_CODES`: de volledige ISO-2 lijst die enkel gebruikt wordt wanneer
  `unrestricted: true`.

**4. Adresstap (`src/pages/CheckoutAddress.tsx`)**

- Verwijder de hardcoded `countries`-constante volledig.
- Bereken `options` uit de hook: `unrestricted` → `FALLBACK_COUNTRY_CODES`, anders
  uitsluitend `countries`.
- Effect dat `addressForm.country` (en `billingForm.country` bij een apart
  factuuradres) corrigeert naar `default_country` zodra de lijst geladen is en de
  huidige waarde er niet in staat. Initiële state wordt niet meer hard op `'BE'`
  gezet maar leeg, tot de lijst binnen is.
- Eén toegestaan land → geen `<select>`, maar een read-only regel met de
  gelokaliseerde naam; de ISO-code gaat gewoon mee in de payload.
- Lege lijst met `unrestricted: false` → melding boven het formulier en de knop
  "Doorgaan naar betaling" verborgen/disabled.
- Laadtoestand: select disabled zolang de lijst nog niet binnen is.

Er komt geen eigen extra validatie bij: bij `checkout_shipping` blijft de server
leidend en de foutmelding daarvan wordt ongewijzigd aan de klant getoond.

**5. Opruiming**

Grep na de wijziging op landenlijsten in checkout-code. `src/pages/Account.tsx`
heeft een vrij tekstveld voor land (geen lijst) en valt buiten deze scope.
