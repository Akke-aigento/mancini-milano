

# Mancini Milano — Luxury E-Commerce Frontend

## Overview
Premium dark luxury fashion webshop for "Mancini Milano" with a high-end aesthetic, full routing, and global layout components.

## Design System Setup
- Update CSS variables to match the dark luxury palette (#0A0A0A background, #C9A96E gold accent, etc.)
- Import Google Fonts: Playfair Display (headings/logo) and Inter (body)
- Configure Tailwind with custom colors, fonts, spacing, and 0px border-radius on buttons
- All text in English

## Global Layout Components

### Announcement Bar
- Fixed top bar, 36px, gold background (#C9A96E), black text
- "FREE WORLDWIDE SHIPPING ON ALL ORDERS"

### Navbar
- Sticky below announcement bar with backdrop blur on #0A0A0A
- Left: "MANCINI MILANO" logo text (Playfair Display, uppercase, wide tracking)
- Center: HOME, FOR HIM (dropdown), FOR HER (dropdown), FRAGRANCES, CONTACT
- Right: Search, Account, Cart icons (with badge)
- Dropdowns: dark overlay with category links
- Mobile: hamburger menu with slide-in drawer

### Footer
- 4-column layout: Brand info, Shop links, Info links, Social + Newsletter
- Bottom bar: copyright + payment method icons
- No "Powered by" text

## Routing (React Router)
All pages as styled placeholder pages with consistent layout:
- `/` — Homepage
- `/collections/:slug` — Collection page
- `/products/:slug` — Product detail
- `/contact` — Contact
- `/about` — About Us
- `/cart` — Cart
- `/faq` — FAQ
- `/privacy-policy` — Privacy Policy
- `/size-guide` — Size Guide

## File Structure
- `src/components/layout/AnnouncementBar.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Layout.tsx` (wraps all pages)
- `src/pages/Index.tsx` (Homepage placeholder)
- `src/pages/Collection.tsx`
- `src/pages/ProductDetail.tsx`
- `src/pages/Contact.tsx`
- `src/pages/About.tsx`
- `src/pages/Cart.tsx`
- `src/pages/FAQ.tsx`
- `src/pages/PrivacyPolicy.tsx`
- `src/pages/SizeGuide.tsx`
- Updated `src/App.tsx` with all routes
- Updated `src/index.css` and `tailwind.config.ts` with design system
- Updated `index.html` with Google Fonts links

