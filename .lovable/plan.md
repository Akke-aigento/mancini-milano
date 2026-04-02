

# Productbeschrijving: HTML renderen i.p.v. plain text

## Probleem
`product.description` bevat HTML tags (`<p>`, `</p>`, etc.) die als plain text worden weergegeven in plaats van gerenderd.

## Oplossing

### `src/pages/ProductDetail.tsx` (regel 291-292)
Vervang `{content}` door een conditionele render: als `key === 'description'`, gebruik `dangerouslySetInnerHTML` om de HTML te renderen. Voor de andere accordion items (shipping, care) gewoon plain text behouden.

**Van:**
```tsx
<div className="pb-4 text-sm text-muted-foreground leading-relaxed">
  {content}
</div>
```

**Naar:**
```tsx
<div className="pb-4 text-sm text-muted-foreground leading-relaxed">
  {key === 'description' ? (
    <div dangerouslySetInnerHTML={{ __html: content }} className="prose prose-sm prose-invert max-w-none" />
  ) : (
    content
  )}
</div>
```

### Eén file
- `src/pages/ProductDetail.tsx`

