

# Exclusive Sectie: Beschrijving Opschonen

## Probleem
De volledige productbeschrijving wordt getoond — een lange muur van tekst die er rommelig uitziet, vooral op mobiel. Dit is een homepage highlight, geen productpagina.

## Oplossing
Toon **niet** de volledige API-beschrijving. Schrijf in plaats daarvan een korte, krachtige teaser-tekst hardcoded in de homepage. De volledige beschrijving hoort op de productpagina zelf (waar de gebruiker naartoe gaat via "Discover").

### `src/pages/Index.tsx` (regels 292-293)

**Van:**
```tsx
<div className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md mx-auto lg:mx-0 prose prose-sm prose-invert max-w-none"
  dangerouslySetInnerHTML={{ __html: fragrance.description }} />
```

**Naar:**
```tsx
<p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md mx-auto lg:mx-0">
  A fragrance for men who dominate without speaking. Intense. Powerful. Unforgettable. Crafted with bold notes of black pepper, cedarwood, and deep patchouli.
</p>
```

Korte, impactvolle copy die past bij de luxury branding — de rest leest men op de productpagina.

### Eén file
- `src/pages/Index.tsx`

