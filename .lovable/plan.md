

# Fix: Newsletter Veldnaam + Login Pagina Engels

## Bevindingen
Ik heb de API calls direct getest en alles werkt:
- Registratie: succesvol, klant wordt aangemaakt in SellQo
- Profiel update: succesvol, wijzigingen worden opgeslagen
- Get profile: retourneert de juiste data

De klant `aaron-mercken@hotmail.com` (ID: `dd53469e-...`) bestaat in SellQo met de juiste naam en telefoon.

## Wat wel fout is

### 1. Newsletter veld: `newsletter` moet `newsletter_opt_in` zijn
De SellQo API verwacht `newsletter_opt_in`, niet `newsletter`. Vanxcel gebruikt het correcte veld. Hierdoor wordt de nieuwsbrief-toggle genegeerd door de API.

### 2. Login pagina is nog in het Nederlands
Alle teksten ("Inloggen", "Registreren", "Vul alle velden in", "Voornaam", etc.) zijn nog steeds Nederlands.

## Wijzigingen

### `src/integrations/sellqo/CustomerAuthContext.tsx`
- Verander `newsletter` naar `newsletter_opt_in` in de `Customer` interface en `updateProfile` type

### `src/pages/Account.tsx`
- Verander de newsletter state/prop van `newsletter` naar `newsletter_opt_in`

### `src/pages/Login.tsx`
- Alle Nederlandse teksten vertalen naar Engels:
  - "Inloggen" → "Sign In"
  - "Registreren" → "Register"
  - "Vul alle velden in" → "Please fill in all fields"
  - "Voornaam" / "Achternaam" → "First Name" / "Last Name"
  - "E-mail" → "Email"
  - "Wachtwoord" → "Password"
  - "Bevestig wachtwoord" → "Confirm Password"
  - "Min. 8 tekens" → "Min. 8 characters"
  - "Hoofdletter" → "Uppercase"
  - "Cijfer" → "Number"
  - Error/success toasts naar Engels

### Drie files
- `src/integrations/sellqo/CustomerAuthContext.tsx`
- `src/pages/Account.tsx`
- `src/pages/Login.tsx`

