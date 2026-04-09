

# Fix: Producten verschijnen niet bij gender + subcategorie filtering

## Probleem

Het product "The Midnight Jacket" staat in SellQo gekoppeld aan zowel "Men" als "Jackets". Maar bij "For Him > Jackets" verschijnt het niet.

**Oorzaak**: De API stuurt bij `category_slug=men` alleen de primaire categorie per product mee (niet alle gekoppelde categorieën). De normalizer maakt `categories: [raw.category]` — met alleen `{slug: 'men'}`. De client-side filter `p.categories?.some(c => c.slug === 'jackets')` vindt dan geen match.

## Oplossing — `src/pages/Collection.tsx`

Dual-fetch strategie: wanneer er een `genderFilter` én een subcategorie `slug` actief zijn, haal producten op voor **beide** slugs en neem de intersectie (producten die in beide resultaten voorkomen).

```text
Huidige flow:
  fetch(category_slug=men) → filter client-side op 'jackets' → FAALT

Nieuwe flow:
  fetch(category_slug=men)     → Set A (alle men producten)
  fetch(category_slug=jackets) → Set B (alle jackets producten)
  intersectie(A, B)            → producten die in beide zitten ✓
```

### Concrete wijzigingen

1. **Tweede `useProducts` call toevoegen** — `useProducts({ category_slug: slug })`, alleen enabled wanneer `genderFilter` aanwezig is
2. **Intersectie berekenen** — in de `genderFilteredProducts` memo: neem producten waarvan het `id` in beide sets voorkomt
3. **Fallback behouden** — als er geen `genderFilter` is, werkt alles zoals nu (één fetch op `slug`)

### Eén bestand

| Bestand | Wijziging |
|---|---|
| `src/pages/Collection.tsx` | Tweede useProducts hook + intersectie-logica |

