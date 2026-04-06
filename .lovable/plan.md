

# Footer Newsletter Koppelen aan SellQo API

## Wat verandert

De footer newsletter-form stuurt nu het e-mailadres naar de SellQo `newsletterAPI.subscribe()`, met loading state en feedback (succes/fout melding) — identiek aan hoe de homepage het al doet.

## `src/components/layout/Footer.tsx`

1. Importeer `newsletterAPI` uit `@/integrations/sellqo/api`
2. Voeg `loading` en `submitted` state toe
3. In de `onSubmit` handler: roep `newsletterAPI.subscribe(email)` aan
4. Toon loading state op de knop tijdens verzending
5. Na succes: toon bevestigingstekst in plaats van het formulier
6. Bij fout: toon een toast/foutmelding

## Eén bestand

| Bestand | Wijziging |
|---|---|
| `src/components/layout/Footer.tsx` | Newsletter form koppelen aan SellQo API + feedback UI |

