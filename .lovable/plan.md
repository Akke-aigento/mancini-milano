

# Fix: Variant Opties (Maat & Kleur) Weer Tonen

## Probleem
De ProductDetail pagina zoekt naar `v.options.size` en `v.options.color` (lowercase), maar de SellQo API retourneert waarschijnlijk keys met hoofdletters ("Size", "Color") of andere namen. Hierdoor worden de opties niet gevonden en niet getoond.

## Oplossing — Twee aanpassingen

### 1. `src/integrations/sellqo/normalizer.ts` — Variant options keys normaliseren (regel 26-36)
Bij het normaliseren van variants, zet alle option-keys om naar lowercase:

```typescript
const rawOptions = v.attribute_values || v.options || {};
const options: Record<string, string> = {};
for (const [key, val] of Object.entries(rawOptions)) {
  options[key.toLowerCase()] = String(val);
}
```

Dit zorgt ervoor dat ongeacht of de API "Size", "SIZE", of "size" retourneert, het altijd als `size` beschikbaar is in de frontend.

### 2. `src/pages/ProductDetail.tsx` — Debug logging toevoegen (tijdelijk)
Voeg een `console.log` toe om de variant data te inspecteren wanneer het product geladen is, zodat we kunnen bevestigen dat de opties correct doorkomt. Dit kan later verwijderd worden.

## Resultaat
Maat- en kleuropties verschijnen weer op de productpagina, ongeacht de key-casing van de API.

## Twee files

