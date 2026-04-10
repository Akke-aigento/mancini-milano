

# Cookie Consent Banner — Minimalistisch & GDPR-conform

## Wat

Een subtiele cookie-banner onderaan het scherm die voldoet aan de Belgische/EU GDPR-wetgeving. Verschijnt alleen bij eerste bezoek, keuze wordt opgeslagen in `localStorage`.

## Design

- Vaste balk onderaan, zwart met subtiele border-top (past bij het donkere thema)
- Korte tekst + link naar Privacy Policy + twee knoppen: "Alleen noodzakelijk" en "Accepteren"
- Verdwijnt na keuze, komt niet meer terug (tenzij localStorage gewist)
- Geen analytics/tracking cookies laden vóór consent

## Technische aanpak

### 1. Nieuw component: `src/components/CookieConsent.tsx`
- Check `localStorage.getItem('cookie-consent')` bij mount
- Drie states: `null` (tonen), `'essential'` (alleen noodzakelijk), `'all'` (alles geaccepteerd)
- Minimale animatie: slide-up bij verschijnen
- Link naar `/privacy-policy`
- Styling: `fixed bottom-0`, `z-50`, consistent met het bestaande donkere thema

### 2. Toevoegen aan `src/components/layout/Layout.tsx`
- `<CookieConsent />` toevoegen naast `<BackToTop />`

### Bestanden

| Bestand | Wijziging |
|---|---|
| `src/components/CookieConsent.tsx` | Nieuw component |
| `src/components/layout/Layout.tsx` | Component importeren en toevoegen |

