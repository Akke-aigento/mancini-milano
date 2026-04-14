

## Fix: Rand rond categorie-kaarten verwijderen

### Wijziging
**`src/pages/Collection.tsx`** regel 111: verwijder `border border-border` van de subcategorie-kaart container.

Van:
```tsx
<div className="relative aspect-[3/4] overflow-hidden mb-3 border border-border">
```
Naar:
```tsx
<div className="relative aspect-[3/4] overflow-hidden mb-3">
```

### Resultaat
Categorie-kaarten op `/collections/men` en `/collections/women` hebben geen zichtbare rand meer — ze vallen naadloos weg tegen de zwarte achtergrond.

