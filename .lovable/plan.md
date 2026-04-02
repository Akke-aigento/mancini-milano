

# Smoother Logo Crossfade Transition

## Change
Increase the transition duration from `500ms` to `700ms` and add a slight scale effect so the swap feels more polished — the text shrinks slightly as it fades out, and the Doberman logo grows in subtly.

### File: `src/components/layout/Navbar.tsx` (lines 135-140)

**Text logo span:** Change from `transition-opacity duration-500 ease-in-out` to `transition-all duration-700 ease-in-out` and add scale: `${scrolled ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`

**Doberman img:** Same change — `transition-all duration-700 ease-in-out` with `${scrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`

This gives a combined fade + subtle scale that feels much smoother and more premium.

