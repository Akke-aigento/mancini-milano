

## Fix: Productafbeeldingen worden afgekapt/ingezoomd

### Probleem
Dit is een **frontend probleem**, niet SellQo. Alle productafbeeldingen gebruiken `object-cover`, wat de afbeelding bijsnijdt om de container te vullen. Als de foto een andere verhouding heeft dan de container (`aspect-[3/4]`), worden delen van het product afgesneden.

### Oplossing
Verander `object-cover` naar `object-contain` op de relevante plekken. Dit toont de volledige afbeelding binnen de container zonder bijsnijden.

### Bestanden en wijzigingen

**1. `src/components/ProductCard.tsx`** (collectiepagina's, related products)
- Beide `<img>` tags: `object-cover` → `object-contain`
- De `bg-card` achtergrondkleur op de container zorgt voor een nette achtergrond waar de afbeelding niet vult

**2. `src/pages/ProductDetail.tsx`** (productdetailpagina)
- Hoofdafbeelding (regel 234): `object-cover` → `object-contain`
- Thumbnails (regel 248): deze kunnen `object-cover` behouden (kleine previews mogen gecropped)

### Wat er niet verandert
- Hero banners, lookbook, categorie-afbeeldingen → blijven `object-cover` (dat is gewenst voor sfeerbeelden)
- Cart/checkout thumbnails → blijven `object-cover` (kleine previews)

### Resultaat
- Volledige productfoto's zichtbaar op collectiepagina en detailpagina
- Geen afgesneden details meer
- Nette achtergrondkleur waar de afbeelding niet vult

