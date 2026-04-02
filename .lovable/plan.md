

# Navbar Logo Transition on Scroll

## What happens
When the user scrolls past the announcement bar (~36px), the "MANCINI MILANO" text logo in the navbar crossfades into the Doberman illustration logo. Scrolling back up reverses the effect.

## How

### 1. Copy uploaded Doberman logo to project
Copy `user-uploads://file_00000000d4e461f49140f97d4f6cfa1c_2-2.png` to `src/assets/logo-doberman.png`

### 2. Modify `src/components/layout/Navbar.tsx`
- Add a `useEffect` + `useState` scroll listener that sets `scrolled = true` when `window.scrollY > 36` (height of announcement bar)
- Replace the static `<Link>` logo with a container holding both elements stacked (using `relative` + `absolute` positioning):
  - The text "MANCINI MILANO" with `opacity` and `transition` — visible when not scrolled, fades out when scrolled
  - The Doberman logo `<img>` (roughly 36-40px height to fit the navbar) — hidden when not scrolled, fades in when scrolled
- CSS transition: `transition-opacity duration-500 ease-in-out` for a smooth crossfade
- Both remain clickable `<Link to="/">`

### Technical detail
```text
<Link to="/" className="relative h-10 w-[140px] flex items-center">
  {/* Text logo - fades out */}
  <span className={`absolute transition-opacity duration-500 ${scrolled ? 'opacity-0' : 'opacity-100'}`}>
    MANCINI MILANO
  </span>
  {/* Doberman logo - fades in */}
  <img src={logoImg} className={`absolute h-9 transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />
</Link>
```

### Files changed
- `src/assets/logo-doberman.png` (new — copied from upload)
- `src/components/layout/Navbar.tsx` — scroll listener + dual logo with crossfade

