

# Mobile Hero: Volledige Foto Zichtbaar

## Probleem
De mobiele hero gebruikt `aspect-[4/5]` met `object-cover`, waardoor de foto wordt bijgesneden. De klant wil de volledige afbeelding zien.

## Oplossing

### `src/pages/Index.tsx` — regel 65-71

Vervang de fixed-aspect container met `object-cover` door een simpele `w-full` image die zijn natuurlijke verhoudingen behoudt:

```tsx
// Van:
<div className="relative aspect-[4/5] overflow-hidden">
  <img
    src={lookbookBanner}
    alt="Mancini Milano Collection"
    className="absolute inset-0 w-full h-full object-cover object-center"
  />
</div>

// Naar:
<div className="w-full overflow-hidden">
  <img
    src={lookbookBanner}
    alt="Mancini Milano Collection"
    className="w-full h-auto"
  />
</div>
```

De afbeelding schaalt nu mee op volledige breedte zonder cropping — de volledige foto is zichtbaar.

### Eén file, één wijziging

