

## Handmatige afbeeldingswissel voor "BLUE STORM" LUXE TEE op t-shirts pagina

### Probleem
Op de t-shirts categoriepagina toont de "BLUE STORM" LUXE TEE de modelfoto als hoofdfoto. De klant wil daar de productfoto (zonder model) zien — maar alleen op de t-shirts categoriepagina, niet op homepage of andere plekken.

### Aanpak
1. **`ProductCard.tsx`** — voeg een optionele `preferredImageIndex` prop toe. Wanneer deze is meegegeven, gebruik die als primaire afbeelding in plaats van `images[0]`.

2. **`Collection.tsx`** — op de t-shirts pagina (`slug === 't-shirts'`), geef voor het product met slug `blue-storm-luxe-tee` (of wat de exacte slug is) een `preferredImageIndex={1}` mee, zodat `images[1]` (de flat-lay foto) als hoofdfoto wordt getoond.

### Concrete wijzigingen

**`src/components/ProductCard.tsx`**
- Interface uitbreiden met `preferredImageIndex?: number`
- De primaire image source wordt `product.images[preferredImageIndex ?? 0]`
- Hover image wordt de andere afbeelding

**`src/pages/Collection.tsx`**
- Map van slug → imageIndex override, alleen actief wanneer de huidige categorie `t-shirts` is
- Meegeven als prop: `<ProductCard product={product} preferredImageIndex={...} />`

### Resultaat
- T-shirts categoriepagina: BLUE STORM toont productfoto zonder model
- Homepage, related products, andere pagina's: ongewijzigd

### Bestanden
1. `src/components/ProductCard.tsx`
2. `src/pages/Collection.tsx`

