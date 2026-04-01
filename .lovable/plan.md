

# Hero Section Update — Doberman Image + Brand Banner

## Overview
Modify the existing homepage hero section to feature the Doberman brand illustration, and add a typography banner between sections. No other sections change.

## Changes

### 1. Copy uploaded images to project assets
- Copy Doberman image to `src/assets/hero-doberman.png`
- Copy MANCINIMILANO banner to `src/assets/brand-banner.png`

### 2. Hero Section Rewrite (Section 1 in Index.tsx, lines 74-115)

**Mobile-first (default):**
- Full viewport height hero with Doberman image covering the entire section
- No text overlay (image already contains "MANCINI MILANO" branding)
- Bottom gradient (transparent to black) with CTA buttons ("SHOP MEN" / "SHOP WOMEN") positioned at the bottom
- Scroll indicator below buttons

**Desktop (md: breakpoint):**
- Split layout: left 50% pure black with headline text + CTAs vertically centered, right 50% Doberman image full height
- Left side shows "DEFINE YOUR OWN LEGACY" headline + subtitle + CTA buttons
- Right image uses `object-fit: cover; object-position: center top`
- Subtle gradient on left edge of image blending into black background

### 3. Brand Banner (new section between categories and trending)

Insert a new full-width section between Section 3 (Featured Categories, line 158) and Section 4 (Trending Now, line 160):
- Full-bleed image of the MANCINIMILANO typography banner
- `loading="lazy"`, max-height ~450px on desktop with `object-fit: cover`
- Simple parallax effect using `background-attachment: fixed` on desktop via a div with background-image instead of an img tag
- No padding/margin — edge-to-edge visual break

### Technical Details

**Files modified:**
- `src/pages/Index.tsx` — hero section rewrite + new banner section insertion
- Two asset files copied into `src/assets/`

**Import pattern:**
```typescript
import heroDoberman from '@/assets/hero-doberman.png';
import brandBanner from '@/assets/brand-banner.png';
```

**Hero responsive approach:**
- Mobile: single full-bleed image, buttons at bottom with gradient overlay
- Desktop: CSS grid `grid-cols-2`, left col = text content, right col = image with gradient-to-left overlay on its left edge

**Parallax banner:** Use a `div` with `style={{ backgroundImage }}` and `bg-fixed bg-cover bg-center` classes for the parallax effect, with an `img` fallback for mobile (where `background-attachment: fixed` doesn't work well).

