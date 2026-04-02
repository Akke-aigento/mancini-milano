

# 3 Fixes: Beschrijving HTML, Exclusive Achtergrond, Banner Tablet

## 1. Fragrance beschrijving — HTML renderen
De `fragrance.description` op de homepage (Exclusive sectie) toont raw HTML tags net als op de productpagina. Fix: gebruik `dangerouslySetInnerHTML`.

### `src/pages/Index.tsx` (regel 289-291)
**Van:**
```tsx
<p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md mx-auto lg:mx-0">
  {fragrance.description}
</p>
```
**Naar:**
```tsx
<div className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md mx-auto lg:mx-0 prose prose-sm prose-invert max-w-none"
  dangerouslySetInnerHTML={{ __html: fragrance.description }} />
```

## 2. Exclusive achtergrond — 100% zwart
De gradient achtergrond geeft een lichte tint. Vervang door pure black.

### `src/pages/Index.tsx` (regel 281)
**Van:**
```tsx
style={{ background: 'linear-gradient(135deg, hsl(0 0% 4%) 0%, hsl(30 10% 8%) 50%, hsl(0 0% 4%) 100%)' }}
```
**Naar:**
```tsx
className="py-20 lg:py-28 bg-black"
```
(verwijder de `style` prop)

## 3. Brand banner — tablet responsive
Op tablet (768px) is de tekst afgesneden omdat `hidden md:block` met vaste hoogte 450px en `bg-fixed` problemen geeft. Fix: op tablet geen parallax, gewoon een gewone `<img>` tag met volle breedte, parallax alleen op `lg:` en hoger.

### `src/pages/Index.tsx` (regels 183-193)
**Van:** twee varianten (mobile `block md:hidden` + desktop `hidden md:block` met `bg-fixed`)
**Naar:** drie varianten:
- Mobile: `block md:hidden` — gewone img
- Tablet: `hidden md:block lg:hidden` — gewone img met `h-[300px] object-cover`
- Desktop: `hidden lg:block` — parallax `bg-fixed h-[450px]`

### Files
- `src/pages/Index.tsx`

