

# Meer van de Banner Foto Tonen op Mobiel

## Probleem
De mobiele hero neemt `100vh - 60px` in en de foto gebruikt `object-cover object-top`, waardoor veel van de foto wordt afgesneden.

## Oplossing
Verander `object-top` naar `object-center` zodat het midden van de foto (de 3 mannen) beter zichtbaar is. Optioneel de hoogte iets verlagen zodat de foto minder gecropped wordt.

### `src/pages/Index.tsx` (regel 71 + 75)
- Hoogte: `h-[calc(100vh-60px)]` → `h-[75vh]` (minder crop)
- Object position: `object-top` → `object-center`

### Resultaat
De foto wordt minder ingezoomd/gecropped, waardoor je meer van de volledige compositie ziet.

### Eén file
- `src/pages/Index.tsx`

