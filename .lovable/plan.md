

# "Coming Soon" voor alle vrouwencategorieën

## Wat
Niet alleen `/collections/women` maar ook alle subcategorieën met `?gender=women` (bijv. `/collections/hoodies?gender=women`) moeten "Coming Soon" tonen.

## Aanpak

**Bestand: `src/pages/Collection.tsx`**

Vroeg in de component, vóór de product-rendering, een extra check toevoegen:

```typescript
if (slug === 'women' || genderFilter === 'women') {
  return (
    <Layout>
      <SEO title="For Her" description="Coming soon — our women's collection at Mancini Milano." />
      <section className="max-w-site mx-auto px-4 lg:px-8 pt-20 pb-32 text-center">
        <h1 className="font-heading text-3xl lg:text-4xl tracking-heading uppercase text-foreground mb-4">
          For Her
        </h1>
        <p className="text-lg text-muted-foreground mb-2">Coming Soon</p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          We're working on our women's collection. Stay tuned.
        </p>
      </section>
    </Layout>
  );
}
```

Dit vangt zowel de parent (`/collections/women`) als alle subcategorieën met `?gender=women` af. Het bestaande `if (isParent && slug === 'women')` blok wordt hierdoor overbodig en kan weg.

