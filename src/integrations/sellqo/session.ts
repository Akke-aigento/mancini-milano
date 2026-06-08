// Stable per-browser session id used to make backend cart_create idempotent.
// Previously cartAPI.create() generated a fresh random uuid on every call,
// which defeated the SellQo idempotency filter (session_id-based) and led to
// 9+ duplicate carts per visitor within 30 min (prod incident 2026-06-08).

const SESSION_KEY = 'mancini_session_id';

export function getOrCreateSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id || id === 'undefined' || id === 'null' || id.trim() === '') {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    const w = window as any;
    if (!w.__mancini_session_id) {
      w.__mancini_session_id = crypto.randomUUID();
    }
    return w.__mancini_session_id as string;
  }
}

// One-shot forward-fix for visitors who already had a `mancini_cart_id`
// before this deploy. We mint a session_id now so the next reconcile/create
// has a stable identifier. The existing cart_id is preserved so the orphan
// cart can still be repaired by the reconcile-flow.
export function ensureSessionForLegacyCart(): void {
  try {
    const cartId = localStorage.getItem('mancini_cart_id');
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (cartId && !sessionId) {
      localStorage.setItem(SESSION_KEY, crypto.randomUUID());
    }
  } catch { /* noop */ }
}
