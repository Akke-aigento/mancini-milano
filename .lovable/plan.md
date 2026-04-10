

# "Free Shipping" tekst overal aanpassen naar €150 minimum

De tekst over gratis verzending moet op 3 plekken worden aangepast:

| Bestand | Huidige tekst | Nieuwe tekst |
|---|---|---|
| `src/components/layout/AnnouncementBar.tsx` | ✅ Al correct | "Free Worldwide Shipping on Orders Over €150" |
| `src/pages/ProductDetail.tsx` regel 228 | "Free worldwide shipping" | "Free worldwide shipping on orders over €150" |
| `src/pages/ProductDetail.tsx` regel 303 | "Free worldwide shipping on all orders..." | "Free worldwide shipping on orders over €150..." |
| `src/pages/FAQ.tsx` regel 12 | "...free worldwide shipping on all orders..." | "...free worldwide shipping on orders over €150..." |
| `src/pages/FAQ.tsx` regel 20 | "...free shipping on all orders..." | "...free shipping on orders over €150..." |

Totaal: 4 tekstaanpassingen in 2 bestanden.

