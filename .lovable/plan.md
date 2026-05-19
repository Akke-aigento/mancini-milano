# Fix: Header is niet meer sticky

## Wat ik zie

Op `/streetwear` (en elke andere wereldpagina) heeft `<Navbar>` netjes `sticky top-0`, maar zodra je scrollt verdwijnt de hele navbar bovenaan het scherm in plaats van te plakken. Bevestigd in de preview: na ~800px scrollen is de header volledig weg.

## Oorzaak

In `src/components/layout/Layout.tsx` staat op de root-wrapper:

```tsx
<div className="min-h-screen flex flex-col animate-in fade-in duration-300 overflow-x-hidden">
```

Die `overflow-x-hidden` is de boosdoener. Browsers behandelen elke `overflow-*: hidden` als "deze container is potentieel een scroll-context". Een `position: sticky` element ankert altijd aan zijn dichtstbijzijnde scrollende voorouder. Resultaat:

- De Navbar denkt dat hij relatief moet plakken binnen de Layout-div.
- Maar de Layout-div scrollt zelf niet (alleen `html`/`body` scrolt) → de sticky heeft effectief geen ankerpunt en gedraagt zich als gewoon `relative`.
- Dus de navbar scrollt mee weg met de rest van de pagina.

Dit is een bekend gedrag van `position: sticky` in combinatie met `overflow: hidden` op een voorouder. Het zat er waarschijnlijk al langer in maar viel niet op omdat WorldSwitch/AnnouncementBar de navbar bovenaan zichtbaar hielden tot je verder scrolde.

## Fix

Verplaats de horizontale-overflow-bescherming van de Layout-wrapper naar het `html, body` niveau in `src/index.css`. Daarmee:

- Blijft de page-breedte nog steeds vergrendeld (geen horizontale scrollbar bij brede children).
- Verdwijnt de scroll-context die de sticky brak, want `html`/`body` is sowieso al de page scroll container.
- Geen enkele andere component verandert van gedrag.

### Concrete wijzigingen

1. **`src/components/layout/Layout.tsx`** — verwijder `overflow-x-hidden` van de root-div:
   ```tsx
   <div className="min-h-screen flex flex-col animate-in fade-in duration-300">
   ```

2. **`src/index.css`** — zorg dat `html, body` `overflow-x: hidden` hebben (toevoegen als het er nog niet staat in de bestaande base layer). Geen andere CSS-regels aanraken.

3. **Verifiëren** — na de wijziging:
   - `/streetwear` → scroll naar beneden → navbar plakt aan de top.
   - `/classic` → idem.
   - `/cart`, `/checkout/*` (wereld-agnostisch) → navbar plakt aan de top.
   - Geen horizontale scrollbar op mobiel of desktop.
   - Geen console errors.

## Wat ik NIET aanraak

- WorldSwitch, AnnouncementBar, LookbookBanner positionering.
- De `sticky top-0` op de navbar zelf — die is correct.
- De WorldContext / homeHref logic van de vorige fix.
- Andere `overflow-*` classes elders in het project.
