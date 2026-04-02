

# Account Pagina: Adres + Nieuwsbrief Toggle

## Wat wordt toegevoegd

1. **Adres tab** — nieuw tabblad waar de klant een bezorgadres kan invoeren/bewerken (straat, huisnummer, postcode, stad, land). Dit adres wordt opgeslagen via de SellQo Customer API (`update_address` / `add_address`) en automatisch ingevuld bij checkout.

2. **Nieuwsbrief toggle** — in de Profiel tab komt een Switch toggle "Inschrijven voor nieuwsbrief". Status wordt opgeslagen via de SellQo API (`update_profile` met `newsletter: true/false`).

## Wijzigingen

### 1. `src/pages/Account.tsx`

**Tabs array uitbreiden:**
- Nieuw tab: `{ id: "address", icon: MapPin, label: "Adres" }`
- Tabs worden: Profiel | Adres | Bestellingen | Wachtwoord

**Nieuw: AddressTab component:**
- Haalt het huidige adres op uit `customer.addresses?.[0]` (eerste/default adres)
- Formulier met velden: straat, huisnummer, postcode, stad, land (dropdown of input)
- Opslaan via `customerApiFetch("update_address", { ... }, token)` of `add_address` als er nog geen adres is
- Zelfde styling als ProfileTab

**ProfileTab uitbreiden met nieuwsbrief toggle:**
- Onder het telefoonveld een Switch component toevoegen met label "Nieuwsbrief"
- State initialiseren uit `customer.newsletter` (boolean)
- Meesturen bij `updateProfile({ ..., newsletter })` 

### 2. `src/integrations/sellqo/CustomerAuthContext.tsx`

- `Customer` interface uitbreiden met `newsletter?: boolean`
- `updateProfile` type uitbreiden om `newsletter` te accepteren

### Twee files
- `src/pages/Account.tsx`
- `src/integrations/sellqo/CustomerAuthContext.tsx`

