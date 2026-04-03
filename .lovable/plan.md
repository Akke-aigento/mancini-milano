

# Fix: Pagina's Vallen Uit Viewport op Desktop

## Probleem
Sommige pagina-elementen (bijv. product detail) steken uit aan de rechterkant van het scherm. Er ontbreekt een globale `overflow-x: hidden` waardoor content horizontaal buiten de viewport kan vallen.

## Oplossing

### `src/components/layout/Layout.tsx` — regel 15
Voeg `overflow-x-hidden` toe aan de root `div`:

```tsx
// Van:
<div className="min-h-screen flex flex-col animate-in fade-in duration-300">

// Naar:
<div className="min-h-screen flex flex-col animate-in fade-in duration-300 overflow-x-hidden">
```

Dit knipt alle horizontale overflow af voor de gehele site — één simpele fix die overal werkt.

### Eén file, één regel

