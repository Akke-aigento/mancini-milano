

# Fix Mobile Hero CTA Positioning + Sticky Navbar

## Two issues to fix

### 1. Mobile scroll CTA positioning
The "SCROLL" indicator and CTA buttons are too close together at the bottom. The buttons need more breathing room from the bottom edge, and the scroll indicator should sit cleanly below them without overlapping.

**Fix in `src/pages/Index.tsx`:**
- Move CTA buttons higher (change `bottom-16` to `bottom-24`)
- Keep scroll indicator at `bottom-6` so there's clear separation

### 2. Sticky Navbar after Announcement Bar scrolls away
The user wants: announcement bar scrolls away naturally, then the navbar "sticks" to the top of the viewport. This is a classic sticky-header pattern.

**Fix in `src/components/layout/Layout.tsx` + `src/components/layout/Navbar.tsx`:**
- Make the navbar `sticky top-0 z-50` so it sticks to the top once the announcement bar (which sits above it in the flow) scrolls out of view
- The announcement bar stays non-sticky (scrolls away naturally)
- This gives the exact behavior described: announcement bar disappears on scroll, navbar slides up and locks at the top

### Files changed
- `src/components/layout/Navbar.tsx` — add `sticky top-0 z-50` to the navbar wrapper
- `src/pages/Index.tsx` — adjust mobile hero CTA button positioning (more space from bottom)

