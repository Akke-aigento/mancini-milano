

# Fix Featured Categories: Replace Accessories with Hoodies + Fix Rendering

## Problem
1. The homepage featured categories list includes 'accessories' but should show 'hoodies' instead
2. Categories may not be rendering because the API category slugs don't match the hardcoded `featuredCategorySlugs`, causing `categories.find()` to return `undefined` for all entries

## Fix in `src/pages/Index.tsx`

### 1. Update `featuredCategorySlugs`
Change from `['t-shirts', 'jackets', 'accessories']` to `['t-shirts', 'jackets', 'hoodies']`

### 2. Update `categoryImages`
- Remove the 'accessories' entry
- Add 'hoodies' with an appropriate image URL from mancinimilano.com (the puffer jacket/hoodie image)

### 3. Fix category rendering to be resilient
The current code tries to match API categories by slug. If the API returns no categories or different slugs, nothing renders. Add a fallback: if a category isn't found in API data, create a simple object with `{ id: slug, slug, name: slug-formatted-as-title }` so the cards always render with the hardcoded images and link correctly to `/collections/{slug}`.

### Changes (single file)
**`src/pages/Index.tsx`** (lines 11-17):
- `categoryImages`: remove 'accessories', add 'hoodies' with image URL
- `featuredCategorySlugs`: replace 'accessories' with 'hoodies'
- `featuredCategories` mapping: add fallback objects when API category not found

