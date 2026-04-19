

## Probleem
Op productpagina (mobile) staat "SOLD OUT" twee keer:
1. De grote knop in de hoofdcontent
2. De sticky footer onderaan

Op desktop is dit minder storend, maar op mobile (zoals in screenshot) overlappen ze visueel direct boven elkaar.

## Onderzoek nodig
Ik moet eerst `src/pages/ProductDetail.tsx` bekijken om te zien hoe de sticky footer wordt gerenderd en of er al een conditie is voor mobile vs desktop.

## Oplossing
Wanneer een product **sold out** is, de sticky mobile footer verbergen (de hoofdknop in de content blijft zichtbaar — die is groot en duidelijk genoeg).

### Wijziging
**`src/pages/ProductDetail.tsx`** — sticky footer:
- Voeg conditie toe: `{!isOutOfStock && <div className="sticky-footer">...</div>}`
- Of: render de sticky footer alleen wanneer er een actie mogelijk is (in stock)

### Resultaat
- Sold out producten: alleen de grote SOLD OUT knop in de content (1x)
- In stock producten: sticky footer blijft werken zoals nu (snelle add-to-cart)
- Geen layout shift, geen dubbele info

