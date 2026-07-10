## Probleem
Wanneer het hamburger-menu open is op mobiel/tablet, scrollt de achterliggende hoofdpagina mee wanneer de gebruiker binnen het menu scrollt (of gewoon veegt). Dat voelt kapot.

## Oplossing
Body-scroll vergrendelen zolang het mobiele menu open is, in `src/components/layout/Navbar.tsx`.

### Aanpak
- `useEffect` toevoegen die reageert op `mobileOpen`.
- Bij open: `document.body.style.overflow = 'hidden'` (en `position: fixed` truc niet nodig — `overflow:hidden` op body volstaat en behoudt de scrollpositie op moderne browsers; op iOS voegen we ook `touch-action: none` toe op de body om rubber-band scroll te blokkeren).
- Bij close/unmount: originele waarden herstellen.
- Geen wijzigingen aan de fullscreen overlay zelf (die heeft al `overflow-y-auto` op de inner container, dus het menu zelf blijft scrollbaar).

### Technisch
```ts
useEffect(() => {
  if (!mobileOpen) return;
  const prevOverflow = document.body.style.overflow;
  const prevTouch = document.body.style.touchAction;
  document.body.style.overflow = 'hidden';
  document.body.style.touchAction = 'none';
  return () => {
    document.body.style.overflow = prevOverflow;
    document.body.style.touchAction = prevTouch;
  };
}, [mobileOpen]);
```

Geen andere componenten of styling worden aangepast.