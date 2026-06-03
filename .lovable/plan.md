Ik begrijp het: in Classic mag niets van de streetwear men/women categorieboom gebruikt worden. De Classic tegels en dropdowns moeten vertrekken van de Classic parent-categorieën, maar de URL mag wel mooi `/classic/collections/men` en `/classic/collections/women` blijven.

Plan:

1. **Classic parent-aliases ondersteunen in `Collection.tsx`**
   - Behandel `/classic/collections/men` intern als SellQo category slug `men-classic`.
   - Behandel `/classic/collections/women` intern als SellQo category slug `classic-women`.
   - Streetwear blijft ongewijzigd: `/streetwear/collections/men` blijft de streetwear `men` categorie.

2. **Classic hoofdpagina links aanpassen**
   - “For Him” linkt naar `/classic/collections/men`.
   - “For Her” linkt naar `/classic/collections/women`.
   - De secundaire tegels onder Classic blijven dynamisch uit de Classic men-categorieboom komen, niet uit streetwear.

3. **Parent-categoriepagina proper houden**
   - Op `/classic/collections/men` tonen we de dropdown/child categorieën van `men-classic` als tegels.
   - Op `/classic/collections/women` tonen we de child categorieën van `classic-women` als tegels.
   - De titel blijft “Men”/“Women”, maar de data komt van de Classic parent.

4. **Navbar/dropdown links consistent maken**
   - In Classic mode linken de topnav “For Him” en “For Her” naar `/classic/collections/men` en `/classic/collections/women`.
   - De dropdown-items blijven naar hun echte Classic child slugs linken, zoals `men-classic-tops`.

Technisch:
- Ik voeg een kleine resolver toe die alleen in Classic mode de route-slug alias omzet naar de echte SellQo slug voor fetching en categorie-lookups.
- De world-filter die streetwear producten uit Classic houdt blijft behouden.