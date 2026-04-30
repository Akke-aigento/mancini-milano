## Scope: 2 security findings

### Issue 1 — Edge function proxies leak error details

**Files:**
- `supabase/functions/sellqo-proxy/index.ts` (line 208)
- `supabase/functions/sellqo-customer-proxy/index.ts` (line 60)

**Changes (catch blocks only):**
- Generate a `request_id = crypto.randomUUID()` at function start (or in catch).
- `console.error("Proxy error:", { request_id, error })` — full detail server-side.
- Response body becomes:
  - `sellqo-proxy`: `{ error: "Proxy request failed", details: "Internal server error", request_id }` (status 502, same shape).
  - `sellqo-customer-proxy`: `{ success: false, error: "Proxy request failed", details: "Internal server error", request_id }` (status 502, same shape).
- Status codes, top-level `error` / `success` fields unchanged → frontend untouched.

### Issue 2 — Unsanitized HTML in product description

**Confirmed scope:** only `src/pages/ProductDetail.tsx:382` renders API HTML.
(`src/components/ui/chart.tsx` uses `dangerouslySetInnerHTML` for internal generated CSS — not user content, out of scope.)

**Changes:**
1. `bun add isomorphic-dompurify` (project uses bun, not pnpm).
2. Create `src/lib/sanitizeHtml.ts` with the allowlist provided (tags: p, br, strong, em, b, i, u, ul, ol, li, a, h1–h6, span, div, blockquote; attrs: href, title, target, rel, class).
3. Create `src/components/SafeHtml.tsx` — a wrapper that renders `<Component className={className} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />` with `as` prop defaulting to `div`.
4. In `ProductDetail.tsx` line 382, replace:
   ```tsx
   <div dangerouslySetInnerHTML={{ __html: content }} className="prose prose-sm prose-invert max-w-none" />
   ```
   with:
   ```tsx
   <SafeHtml html={content} className="prose prose-sm prose-invert max-w-none" />
   ```
   Preserve className exactly so Tailwind typography keeps working.

### Out of scope
- No changes to frontend error handling.
- No changes to `chart.tsx` (internal CSS, not API content).
- No other files touched.

### Verification after implementation
- PDP description still renders formatted HTML (links, bold, lists).
- Edge function 502 responses keep the same JSON shape, only `details` content changes.
- No TypeScript or console errors.