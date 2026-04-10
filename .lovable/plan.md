

# Fix: Hoofdafbeelding prioriteit in product normalizer

## Analyse

De normalizer sorteert images op `position`, maar als SellQo een apart `image` of `featured_image` veld meestuurt naast de `images` array, wordt dit veld **alleen** gebruikt als er helemaal geen images zijn. Als het wél images zijn maar de featured image niet `position: 0` heeft, verschijnt de verkeerde afbeelding eerst.

## Oplossing — `src/integrations/sellqo/normalizer.ts`

Na het sorteren op position, controleer of `raw.image` of `raw.featured_image` overeenkomt met een afbeelding in de array. Zo ja, verplaats die naar index 0. Zo nee (en het veld bestaat), voeg het toe als eerste element.

```typescript
// Na de sort, prioriteer featured_image/image
const featuredUrl = typeof raw.featured_image === 'string' 
  ? raw.featured_image 
  : (typeof raw.image === 'string' ? raw.image : null);

if (featuredUrl && images.length > 0) {
  const featuredIdx = images.findIndex(img => img.url === featuredUrl);
  if (featuredIdx > 0) {
    const [featured] = images.splice(featuredIdx, 1);
    images.unshift(featured);
  } else if (featuredIdx === -1) {
    images.unshift({ id: 'featured', url: featuredUrl, alt: raw.name || '', position: -1 });
  }
}
```

Dit garandeert dat de door SellQo aangeduide hoofdafbeelding altijd `images[0]` is, ongeacht position-waarden.

| Bestand | Wijziging |
|---|---|
| `src/integrations/sellqo/normalizer.ts` | Featured image naar index 0 forceren na sort |

