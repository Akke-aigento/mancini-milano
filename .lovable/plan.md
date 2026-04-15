

## Fix: Maat-sortering toekomstbestendig maken

### Probleem
De huidige `SIZE_ORDER` map in `ProductDetail.tsx` bevat alleen letter-maten (XXS–3XL). Nieuwe producten met numerieke maten (bv. schoenmaten 39, 40, 41 of broekaten 28, 30, 32) krijgen allemaal fallback `99` en worden willekeurig geordend.

### Oplossing
De sorteerlogica uitbreiden met een slimme fallback:

1. **Extractie naar gedeeld utility** (`src/lib/size-utils.ts`)
   - `SIZE_ORDER` map verplaatsen uit ProductDetail naar een herbruikbaar bestand
   - Kan in de toekomst ook door andere componenten gebruikt worden

2. **Verbeterde sorteerlogica**
   - Letter-maten: bestaande mapping (XXS=0 → 3XL=7)
   - Numerieke maten: automatisch numeriek sorteren (38 < 39 < 40 < 41)
   - Gemengd (bv. "EU 42"): numeriek deel extraheren en daarop sorteren
   - Onbekend: alfabetisch als laatste fallback

3. **Concrete code**
```typescript
// src/lib/size-utils.ts
const SIZE_ORDER: Record<string, number> = {
  'one size': -1, 'os': -1, 'xxs': 0, 'xs': 1, 's': 2, 
  'm': 3, 'l': 4, 'xl': 5, 'xxl': 6, '2xl': 6, 
  'xxxl': 7, '3xl': 7, '4xl': 8, '5xl': 9,
};

export function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const al = a.toLowerCase().trim();
    const bl = b.toLowerCase().trim();
    const aMap = SIZE_ORDER[al];
    const bMap = SIZE_ORDER[bl];
    // Both in letter map
    if (aMap !== undefined && bMap !== undefined) return aMap - bMap;
    // One in map, other not → mapped first
    if (aMap !== undefined) return -1;
    if (bMap !== undefined) return 1;
    // Both numeric
    const aNum = parseFloat(al.replace(/[^0-9.]/g, ''));
    const bNum = parseFloat(bl.replace(/[^0-9.]/g, ''));
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
    if (!isNaN(aNum)) return -1;
    if (!isNaN(bNum)) return 1;
    // Alphabetical fallback
    return al.localeCompare(bl);
  });
}
```

4. **ProductDetail.tsx aanpassen** — import `sortSizes` en vervang de inline sort

### Bestanden
- **Nieuw**: `src/lib/size-utils.ts`
- **Bewerken**: `src/pages/ProductDetail.tsx` — inline SIZE_ORDER + sort vervangen door `sortSizes()` import

### Resultaat
Alle maten — letter, numeriek, of gemengd — worden altijd logisch gesorteerd, ook voor toekomstige producten zonder code-aanpassingen.

