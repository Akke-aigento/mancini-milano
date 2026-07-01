## Plan: Seamless Splash Tiles

### Problem
The 2×2 splash grid currently shows visible black spacing between tiles due to:
1. `border-border/40` + positional border utilities (`border-r`, `border-b`) on grid items.
2. Mobile `aspect-square` creates a fixed 195×195px tile inside a taller `main` area, leaving dead black space below the grid.

### Changes
1. **Remove all tile borders** in `src/pages/Splash.tsx`: delete `border-border/40`, `[&:nth-child(odd)]:border-r`, and `[&:nth-child(-n+2)]:border-b` from the tile `<Link>` className.
2. **Center the grid block vertically** within the remaining viewport so tiles meet edge-to-edge without floating awkwardly.
3. **Verify both mobile and desktop** render edge-to-edge tiles with no visible black cracks between them.

### Expected Result
Four tiles forming one contiguous image block with no borders or gaps, nicely centered on screen.