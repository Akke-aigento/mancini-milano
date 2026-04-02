
# Homepage secties: echte oorzaak en fix

## Wat ik heb nagekeken
- De API werkt:
  - `GET /products?category_slug=trending` geeft 4 producten terug
  - categorie `trending` bestaat ook echt
- In `src/pages/Index.tsx` staat:
  - `Trending Now` al gekoppeld aan `useProducts({ category_slug: 'trending' })`
  - `Shop the Look` en `Exclusive` hangen nog af van de algemene `useProducts()` lijst

## Root cause
De bug zit niet meer in `Trending Now`, maar in deze 2 regels:

```ts
const blueStormProducts = products.filter(
  (p) => p.slug === 'blue-storm-luxe-tee' || p.slug === 'silent-authority'
).slice(0, 2);

const fragrance = products.find((p) => p.slug === 'mancini-milano');
```

`products` komt uit de algemene `/products` query en die is gepagineerd. Daardoor zitten `blue-storm-luxe-tee`, `silent-authority` en `mancini-milano` mogelijk niet in die eerste response, ook al bestaan ze wel in de catalogus. Dan renderen beide secties niet.

## Plan

### 1. `src/pages/Index.tsx` — stop met zoeken in de algemene productlijst
Vervang de slug-lookup op `products` door gerichte product queries.

Nieuw patroon:
- `useProduct('blue-storm-luxe-tee')`
- `useProduct('silent-authority')`
- `useProduct('mancini-milano')`

Daarna:
- `blueStormProducts` opbouwen uit de 2 losse product-responses
- `fragrance` rechtstreeks uit `useProduct('mancini-milano')`

## Concreet
In plaats van:
```ts
const { data: products = [] } = useProducts();
const blueStormProducts = products.filter(...);
const fragrance = products.find(...);
```

Wordt het conceptueel:
```ts
const { data: blueStormTee } = useProduct('blue-storm-luxe-tee');
const { data: silentAuthority } = useProduct('silent-authority');
const { data: fragrance } = useProduct('mancini-milano');

const blueStormProducts = [blueStormTee, silentAuthority].filter(Boolean);
```

### 2. `Trending Now` laten zoals het nu staat
Deze sectie gebruikt al de juiste query:
```ts
useProducts({ category_slug: 'trending' })
```
De netwerklogs bevestigen dat deze correct data terugkrijgt. Daar is dus geen nieuwe logica nodig.

### 3. Rendering robuuster maken
Voor de 2 homepage-secties:
- render alleen als de specifieke query data heeft
- niet meer afhankelijk van toevallig aanwezige producten in een algemene lijst

## Resultaat
- `Trending Now`: producten uit categorie slug `trending`
- `Shop the Look`: verschijnt zodra `blue-storm-luxe-tee` en/of `silent-authority` geladen zijn
- `Exclusive`: verschijnt zodra `mancini-milano` geladen is

## Technische details
- Dit is een data-flow probleem, geen styling probleem.
- De algemene `useProducts()` query is niet betrouwbaar voor homepage hero-secties die op vaste slugs moeten steunen.
- De juiste oplossing is dus:
  - algemene lijst gebruiken voor overzichten
  - `useProduct(slug)` gebruiken voor vaste spotlight-secties

## Files
- `src/pages/Index.tsx`
