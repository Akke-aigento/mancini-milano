

# Navbar Mobiel: Iconen Herschikken

## Gewenste volgorde op mobiel (links → rechts)
```text
[☰] [🔍]          [🐕]          [👤] [🛒]
 ↑    ↑             ↑             ↑    ↑
ham  zoek          logo         account cart
```

## Huidige situatie
Alle iconen (zoek, account, cart, hamburger) zitten in één `div` rechts. Logo is gecentreerd via `absolute left-1/2`. Hamburger staat helemaal rechts.

## Wijzigingen in `src/components/layout/Navbar.tsx`

### Mobiele layout (regels 145-217)
Splits de navbar in drie secties, alleen zichtbaar op mobiel (`lg:hidden` / `hidden lg:flex`):

**Links (mobiel):** Hamburger + Zoek
**Midden:** Logo (al gecentreerd)
**Rechts (mobiel):** Account + Cart

Op desktop blijft alles zoals het is — de huidige `div` met zoek/account/cart blijft behouden met `hidden lg:flex`, en een aparte mobiele layout wordt toegevoegd met `lg:hidden`.

Concreet:
1. Voeg vóór het logo een mobiele linker-groep toe: `<div className="flex items-center gap-1 lg:hidden">` met hamburger-button en zoek-button
2. Voeg na het logo een mobiele rechter-groep toe: `<div className="flex items-center gap-1 lg:hidden">` met account-link en cart-button
3. De bestaande iconen-div krijgt `hidden lg:flex` zodat die alleen op desktop zichtbaar is
4. Verwijder de hamburger uit de bestaande iconen-div (die is nu in de mobiele linker-groep)

### Eén file: `src/components/layout/Navbar.tsx`

