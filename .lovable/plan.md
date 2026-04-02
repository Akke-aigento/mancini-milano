

# Move Scroll Indicator Above CTA Buttons on Mobile

## Problem
The bouncing "Scroll" indicator sits at `bottom-10` which falls below the CTA buttons (`bottom-24`) and gets cut off on smaller screens.

## Fix
Restructure the mobile hero bottom content so the scroll indicator appears **above** the CTA buttons. Combine them into a single absolutely-positioned container at the bottom, with scroll indicator first (top) and buttons below.

### Change in `src/pages/Index.tsx` (lines 85-104)
Replace the two separate absolute containers with one unified container:
- Single container at `bottom-6` with `flex-col items-center gap-4`
- Order: scroll indicator first, then CTA buttons below
- This ensures the scroll indicator is always visible above the buttons regardless of screen size

