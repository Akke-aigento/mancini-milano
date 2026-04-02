

# Background Color Fix — Match Product Photo Black

## Problem
The site background is `#0A0A0A` (HSL `0 0% 4%`) but product photos use pure black `#000000`. This creates a visible contrast/border around product images.

## Fix
Change `--background` from `0 0% 4%` to `0 0% 0%` (pure `#000000`) in `src/index.css`. Also update `--card` and `--surface` values to maintain hierarchy:

- `--background`: `0 0% 0%` (was 4%) — pure black, matches photos
- `--card`: `0 0% 5%` (was 8%) — slightly lighter for card surfaces
- `--surface`: `0 0% 5%` (was 8%) — same adjustment
- `--secondary`, `--muted`, `--accent`: `0 0% 7%` (was 10%) — keep subtle contrast hierarchy

### File: `src/index.css` (lines 7, 10, 13, 22-23, 25-26, 28-29, 39-40)

