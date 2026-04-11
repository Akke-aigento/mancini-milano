

# "Coming Soon" voor For Her categoriepagina

## Wat
Wanneer `slug === 'women'`, toon een "Coming Soon" pagina in plaats van het subcategorie-grid. De "For Him" (`men`) pagina blijft gewoon werken.

## Aanpak

**Bestand: `src/pages/Collection.tsx`**

In het `if (isParent)` blok (regel 96), een extra check toevoegen:

```typescript
if (isParent && slug === 'women') {
  return (
    <Layout>
      <SEO title="For Her" ... />
      <section className="... text-center py-32">
        <h1>For Her</h1>
        <p>Coming Soon</p>
        <p>We're working on our women's collection. Stay tuned.</p>
      </section>
    </Layout>
  );
}
```

De styling volgt het bestaande design: `font-heading`, uppercase heading, `text-muted-foreground` voor subtekst. Minimaal en on-brand.

Wanneer er later producten zijn, verwijder je simpelweg dit blok en werkt de normale grid weer.

