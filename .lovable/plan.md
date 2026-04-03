

# Fix: Content Valt Buiten Viewport

## Oorzaak
Het bestand `src/App.css` is een overgebleven Vite-boilerplate met:
```css
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}
```
Dit beperkt de breedte en voegt padding toe aan het root-element, waardoor content soms buiten de viewport valt of niet de volledige breedte benut.

## Oplossing

### 1. `src/App.css` — Verwijder of leeg het bestand
Verwijder alle inhoud — dit is puur Vite-boilerplate die niet nodig is. De Layout component en Tailwind regelen al de styling.

### 2. `src/index.css` — Voeg globale overflow-beveiliging toe
Voeg toe aan de `@layer base` body-stijlen:
```css
html, body {
  overflow-x: hidden;
  width: 100%;
}
```

Dit geeft dubbele bescherming: de boilerplate-beperkingen worden verwijderd, en horizontale overflow wordt op het hoogste niveau geblokkeerd.

### Twee files

