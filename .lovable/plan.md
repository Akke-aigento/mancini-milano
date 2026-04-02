

# Navbar at Bottom of Viewport on First Load

## Concept
When landing on the homepage (desktop), the lookbook banner expands to fill the viewport minus the navbar height. This pushes the navbar to the very bottom of the screen — like a footer. As the user scrolls, the banner scrolls away and the navbar becomes sticky at the top as it already does.

## How

### 1. `src/components/layout/LookbookBanner.tsx`
- Set the banner height to `calc(100vh - 36px - 64px)` on desktop (100vh minus announcement bar 36px minus navbar 64px)
- On mobile keep a reasonable fixed height like `h-[50vh]` since the effect is less impactful on small screens
- Use `object-cover object-center` to keep the photo looking good at this size

### 2. No other files need changes
The navbar is already `sticky top-0` so once the user scrolls past the banner, it locks to the top naturally. The layout order (AnnouncementBar → LookbookBanner → Navbar) already places it correctly.

### Result
```text
┌─────────────────────────┐
│   FREE SHIPPING BAR     │  ~36px
├─────────────────────────┤
│                         │
│                         │
│    LOOKBOOK BANNER      │  fills remaining
│    (full viewport)      │  viewport height
│                         │
│                         │
├─────────────────────────┤
│  NAVBAR (at bottom)     │  64px ← looks like footer
└─────────────────────────┘
```
After scrolling → navbar sticks to top as usual.

### File changed
- `src/components/layout/LookbookBanner.tsx` — add `h-[50vh] md:h-[calc(100vh-100px)]`

