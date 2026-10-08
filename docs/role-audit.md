# Role audit

## Cart-sync hardening
- `useCreateCart` idempotency-guard (localStorage + sessionStorage mirror + in-flight promise) to prevent duplicate empty carts within the same browser session.
- `Checkout` reconciliation when `initCheckout` returns fewer items than the local CartContext: create a fresh server cart, re-add every local item via `Promise.allSettled`, swap `mancini_cart_id`, mark old cart as orphaned (`mancini_orphaned_carts`) and re-init checkout.
- Fail-state (`checkoutBlocked`) with banner + "Pagina herladen" button + disabled "Doorgaan naar gegevens" CTA when reconciliation fails or the post-reconcile cart is still empty.

## Reconcile-flow normalisatie fix
- `Checkout.reconcileCart` now runs `cartAPI.create()` response through `extractSingle<Cart>() + normalizeCart()` (same pattern as `createCartIdempotent` in `hooks.ts`). Previously it read `.data.id` directly and received `undefined` because the SellQo storefront API returns `{ cart_id: <uuid> }`, causing the false-positive "cart_create returned no id" error and an empty checkout total.
- `cartAPI.addItem` responses are not normalised in the reconcile loop because only success/failure is consumed (`Promise.allSettled`); the authoritative cart state is re-fetched via the follow-up `initCheckout(newCartId)` call.

## Cart session_id stability fix
- New `getOrCreateSessionId()` helper in `src/integrations/sellqo/session.ts` mints a stable per-browser `mancini_session_id` (localStorage, in-memory fallback for strict privacy mode).
- `cartAPI.create()` now sends `session_id: getOrCreateSessionId()` instead of a fresh `crypto.randomUUID()` per call. Previously every call generated a new session_id, defeating the SellQo backend's idempotency filter (filter key = session_id) and producing 9 carts in 30 min for a single visitor (prod incident 2026-06-08).
- `Checkout.reconcileCart` now delegates cart creation to `createCartIdempotent` (re-exported from `hooks.ts`) so the in-flight guard prevents parallel creates inside the same paint cycle.
- `ensureSessionForLegacyCart()` runs once at app boot (`src/main.tsx`) — for visitors who already had a `mancini_cart_id` but no `mancini_session_id`, a session_id is minted now while the legacy cart_id is preserved so the reconcile-flow can still repair it.

## Rapid-refresh race fix
- `Checkout.tsx` now uses `initStarted` useRef as init-guard (StrictMode/re-entry safe) and `reconcileAttempted` useRef as mount-guard — at most one reconcile per Checkout page mount.
- Mismatch detection only runs AFTER a successful `initCheckout` resolve. If `initCheckout` throws, the page shows the error-banner via `setCheckoutBlocked(true)` and does NOT attempt reconcile (prevents creating a fresh cart on transient backend errors).
- After a successful init with items, `Checkout` writes the authoritative server cart into the react-query cache at `sellqoKeys.cart(cartId)` so `useSellQoCart()` / `CartContext` follows the server-state. This eliminates the "old + new items mix" after rapid-refresh + add-item.
- Diagnostic logging added in `createCartIdempotent` (timestamp + in-flight state + resulting cart_id) for future race diagnosis.

## 2026-10-04 — Splash-fallback + categoryvolgorde
- `SplashScreen`: fallback `setTimeout(() => setPhase('done'), 1200)` zodra phase `'out'` wordt (opgeruimd in de effect-cleanup); `onTransitionEnd` blijft. `handleClose` gaat vanuit `'in'` direct naar `'done'`, anders `'out'`. Root-div is `pointer-events-none` zolang phase `!== 'hold'`. Visueel identiek.
- Mount-timers gebruiken functionele guards (`inTimer`: `p === 'in' ? 'hold' : p`, `outTimer`: `p === 'hold' ? 'out' : p`) zodat een vroege close niet wordt overschreven: anders zette de inTimer de splash na een close tijdens `'in'` weer op `'hold'` (zichtbaar), en zette de outTimer na een close tijdens `'hold'` opnieuw `'out'` op een vers gemounte div zonder transitie.
- Oorzaak klik-bug: `'done'` werd alleen via `transitionend` bereikt. Vuurde dat event niet (o.a. de outTimer-herstart hierboven, achtergrondtab), dan bleef een onzichtbare `fixed inset-0 z-[100]`-laag alle kliks blokkeren.
- `normalizeCategory(raw, index)`: `position = raw.position ?? raw.sort_order ?? index`; `normalizeCategories` geeft de array-index mee.
- Oorzaak menuvolgorde: de storefront-API levert categorieën al gesorteerd op `sort_order` maar stuurt het veld niet mee → `position` stond altijd op 0 → Navbar sorteerde alfabetisch.
- Verificatie volgt na publish.

## 2026-10-06 — MM-CART-FIX
- Oorzaak: `cart_get` geeft bij een verlopen cart (30 dagen) `{ success: true, data: null }`. `createCartIdempotent` deed `extractSingle(result) || result` → `normalizeCart` → cart met `id: ''`, behandelde die als "reused existing" → `addItem` op `/cart//items` → generieke toast. Het stale ID werd nooit gewist, dus de browser bleef permanent vastzitten.
- `readCart()` (hooks.ts) geeft alleen een cart terug met een niet-leeg id. `createCartIdempotent` hergebruikt alleen zo'n cart; anders `clearStoredCartId()` en een nieuwe cart aanmaken. `useCartQuery` past dezelfde regel toe (data null → ID wissen).
- `useAddToCart`: faalt `addItem` met een cart-fout (code `CART_NOT_FOUND`/`CART_EXPIRED`/`INVALID_CART`, of een message over cart not found/expired/invalid of een ongeldige uuid), dan wordt het ID gewist, een nieuwe cart aangemaakt en één keer opnieuw geprobeerd. Geeft `addItem` geen bruikbare cart terug (core `cartAddItem` checkt `expires_at` niet), dan geldt dat als `CART_EXPIRED` → retry. Er wordt niet op HTTP-status gematcht: upstream geeft hier 500's.
- Foutmeldingen: `sellqoFetch` gooit `SellQoError` (status/code/details; message ongewijzigd). `INSUFFICIENT_STOCK` → "Only {n} left" (n = `error_details.available_stock` > 0), anders "Sorry, this size is sold out". Andere codes → de message van de API. Geen code → de bestaande generieke tekst.
- `sellqo-proxy`: bij non-2xx wordt `error` (object, of een JSON-string `{code, message, available_stock}`) geparst. `error` blijft een string; `error_code` en `error_details` worden toegevoegd. De frontend werkt vóór en na de proxy-deploy (zonder code → generieke tekst).
- De diagnostische logging in `createCartIdempotent` (zie "Rapid-refresh race fix") is verwijderd.
- Verificatie volgt na publish en na de proxy-deploy.

## 2026-10-08 — MM-AUTO-REFRESH
- Aanleiding: na een publish bleven open tabbladen de oude bundle draaien. Een tester zag na MM-CART-FIX de cart-bug nog in oude tabs.
- Build-ID: een inline Vite-plugin in `vite.config.ts` (geen dependency) zet bij `build` een id (`Date.now()` + korte random) als define `__BUILD_ID__` in de bundle en schrijft `dist/version.json` (`{"build":"<id>"}`). In dev is `__BUILD_ID__` `"dev"` en staat de check uit.
- `src/lib/versionCheck.ts`: haalt `/version.json?t=<now>` op (`cache: 'no-store'`) bij `visibilitychange` → visible en elke 10 min (alleen als het tabblad zichtbaar is). Een ander id dan `__BUILD_ID__` → update pending. Fouten (offline, 404, SPA-fallback-HTML) worden stil genegeerd.
- Herladen gebeurt alleen bij de volgende route-wissel (`useApplyUpdateOnNavigation`, in `App.tsx` binnen `BrowserRouter`), op de nieuwe URL. Nooit als de huidige of de nieuwe route met `/checkout` begint, en nooit als er een veld met focus of een ingevuld veld in de DOM staat; dan wacht de update op een volgende wissel (dus na de checkout).
- Loop-bescherming: sessionStorage `mancini_reload_guard`, max 1 reload per build-ID per tab. `vite:preloadError` (kapotte lazy chunk na een publish) → één `location.reload()` met dezelfde guard (key `preload:<build-id>`).
- Hosting: `version.json` wordt client-side ge-cache-bust (`?t=` + `no-store`), dus er is geen cache-header nodig. Kanttekening: als de host `index.html` zelf agressief zou cachen, kan een reload nog oude code geven; de guard voorkomt dan een loop.
- Cart en login (localStorage) blijven bewaard; er wordt niets gewist.
- Verificatie: build → `dist/version.json` met hetzelfde id als in de bundle. Playwright tegen `vite preview` met gemockte `version.json`: reload bij navigatie (1x), geen tweede reload, geen reload binnen of bij het verlaten van `/checkout`, geen reload bij een ingevuld of gefocust blijvend veld, preloadError 1x, en 404/HTML stil. Productie-verificatie volgt na publish.
