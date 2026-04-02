

# Login/Register + Winkelmandje: Volledige Implementatie

## Overzicht
We bouwen hetzelfde authenticatiesysteem als in Vanxcel: klanten registreren/inloggen via de SellQo Customer API (niet Supabase Auth). Het token wordt opgeslagen in localStorage en de klant wordt gekoppeld aan jullie SellQo tenant.

## Wat wordt gebouwd

### 1. Edge Function: `sellqo-customer-proxy`
Een nieuwe proxy edge function die requests doorstuurt naar de SellQo `storefront-customer-api`. Ondersteunt acties als `login`, `register`, `get_profile`, `update_profile`, `change_password`, `get_orders`, etc. Het `x-storefront-token` header wordt doorgesluisd voor authenticated requests.

### 2. Customer Client (`src/integrations/sellqo/customerClient.ts`)
Frontend client die POST requests maakt naar de customer proxy. Stuurt de tenant ID mee en het storefront token indien ingelogd.

### 3. Auth Context (`src/integrations/sellqo/CustomerAuthContext.tsx`)
React context met:
- `customer` (profiel data)
- `login(email, password)`
- `register(email, password, first_name, last_name)`
- `logout()`
- `updateProfile(data)`
- `isAuthenticated`, `loading`

Token wordt bewaard in localStorage. Bij app start wordt het profiel opgehaald om de sessie te valideren.

### 4. Login/Register Pagina (`src/pages/Login.tsx`)
Strak formulier passend bij de Mancini Milano branding:
- Tab-switcher login/register
- Login: email + wachtwoord
- Register: voornaam, achternaam, email, wachtwoord + bevestiging
- Wachtwoord sterkte indicator
- Redirect naar `/account` na succes
- Password visibility toggle

### 5. Account Pagina (`src/pages/Account.tsx`)
Dashboard met tabs:
- **Profiel** — naam, email bekijken/bewerken
- **Bestellingen** — orderhistorie ophalen via SellQo
- **Wachtwoord wijzigen**
- Uitloggen

### 6. Navbar Update
- User icon linkt naar `/login` als niet ingelogd
- User icon linkt naar `/account` als wel ingelogd
- Zelfde logica in mobiel menu

### 7. Routes (`App.tsx`)
- `/login` → Login pagina
- `/account` → Account pagina (redirect naar login als niet auth)
- `CustomerAuthProvider` wrappen rond de hele app

## Technische Details

### Edge Function Endpoint
```
POST /functions/v1/sellqo-customer-proxy
Body: { action: "login", tenant_id: "...", params: { email, password } }
Header: x-storefront-token (voor authenticated calls)
```

Upstream: `https://gczmfcabnoofnmfpzeop.supabase.co/functions/v1/storefront-customer-api`

### Bestanden

| Bestand | Actie |
|---------|-------|
| `supabase/functions/sellqo-customer-proxy/index.ts` | Nieuw — proxy edge function |
| `src/integrations/sellqo/customerClient.ts` | Nieuw — frontend API client |
| `src/integrations/sellqo/CustomerAuthContext.tsx` | Nieuw — auth context + provider |
| `src/pages/Login.tsx` | Nieuw — login/register pagina |
| `src/pages/Account.tsx` | Nieuw — account dashboard |
| `src/App.tsx` | Update — routes + provider toevoegen |
| `src/components/layout/Navbar.tsx` | Update — user icon conditionally linken |

