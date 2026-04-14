

## Fix: Homepage categorieën tonen alleen mannenproducten

### Probleem
De homepage linkt naar bijv. `/collections/t-shirts` zonder gender-filter. Hierdoor worden zowel mannen- als vrouwenproducten getoond.

### Oplossing
Voeg `?gender=men` toe aan de homepage categorie-links zodat alleen mannenproducten worden getoond.

### Bestand
**`src/pages/Index.tsx`** — regel 157:
```tsx
// Van:
to={`/collections/${cat.slug}`}
// Naar:
to={`/collections/${cat.slug}?gender=men`}
```

