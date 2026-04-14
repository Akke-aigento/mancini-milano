

## Fix: Categorie-afbeelding gecropped

### Probleem
De categorie-kaart afbeeldingen gebruiken `object-cover` (regel 117), wat de afbeelding bijsnijdt om het hele `aspect-[3/4]` vlak te vullen. Bij afbeeldingen die niet exact 3:4 zijn (zoals jackets-women), wordt een deel afgesneden.

### Oplossing
Verander `object-cover` naar `object-contain` zodat de volledige afbeelding zichtbaar is zonder cropping. De afbeelding wordt dan proportioneel geschaald binnen het kader.

### Wijziging
**`src/pages/Collection.tsx`** regel 117:
```tsx
// Van:
className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
// Naar:
className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
```

### Resultaat
Categorie-afbeeldingen worden volledig getoond zonder afsnijding.

