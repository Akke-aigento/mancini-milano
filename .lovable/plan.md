

# Lookbook Photo Banner — Under Shipping Bar

## What
Add the uploaded lookbook photo as a slim, full-width cinematic banner between the shipping bar and the navbar. It acts as a secondary announcement/lookbook strip.

## Design
- Full-width image, fixed height: ~60px on mobile, ~80px on desktop
- `object-cover` + `object-position: top` to focus on the models' upper bodies
- Subtle left/right black gradient vignettes to blend edges into the pure black background
- Optional: small centered gold text overlay like "FW COLLECTION" in tiny uppercase tracking
- No parallax — it's a slim strip, not a hero section

## Changes

### 1. Copy uploaded image
Copy `user-uploads://PHOTO-2026-04-02-12-41-24.jpg` → `src/assets/lookbook-banner.jpg`

### 2. Update `src/components/layout/Layout.tsx`
Add the lookbook banner component between `<AnnouncementBar />` and `<Navbar />`:
```
<AnnouncementBar />
<LookbookBanner />   ← new
<Navbar />
```

### 3. Create `src/components/layout/LookbookBanner.tsx`
A simple full-width strip component:
- Background image covering the full width
- Height constrained to ~60-80px
- Left/right gradient overlays fading to black
- Scrolls away naturally with the announcement bar (not sticky)

### Files
- `src/assets/lookbook-banner.jpg` (new)
- `src/components/layout/LookbookBanner.tsx` (new)
- `src/components/layout/Layout.tsx` (add import + render)

