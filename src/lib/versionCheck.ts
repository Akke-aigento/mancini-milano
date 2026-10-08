import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Detects a newer publish (dist/version.json vs. __BUILD_ID__) and reloads on the
// next route change, so open tabs stop running old code. Cart/login in
// localStorage survive the reload; nothing is cleared here.

const CHECK_INTERVAL_MS = 10 * 60 * 1000;
const RELOAD_GUARD_KEY = 'mancini_reload_guard';

let pendingBuild: string | null = null;

// At most one reload per key (= build id) per tab, to rule out reload loops.
function tryReload(key: string): boolean {
  try {
    if (sessionStorage.getItem(RELOAD_GUARD_KEY) === key) return false;
    sessionStorage.setItem(RELOAD_GUARD_KEY, key);
  } catch {
    return false;
  }
  window.location.reload();
  return true;
}

async function check() {
  try {
    // ?t= busts any cache, so version.json needs no special headers.
    const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return;
    const { build } = await res.json();
    if (typeof build === 'string' && build && build !== __BUILD_ID__) pendingBuild = build;
  } catch {
    // offline, 404 or SPA fallback HTML — ignore
  }
}

export function startVersionCheck() {
  // A failed lazy chunk usually means a new publish removed it.
  window.addEventListener('vite:preloadError', (event) => {
    if (tryReload(`preload:${__BUILD_ID__}`)) event.preventDefault();
  });

  if (__BUILD_ID__ === 'dev') return;

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check();
  });
  setInterval(() => {
    if (document.visibilityState === 'visible') check();
  }, CHECK_INTERVAL_MS);
}

const isCheckout = (pathname: string) => pathname.startsWith('/checkout');

const SKIPPED_INPUT_TYPES = new Set(['hidden', 'submit', 'button', 'reset', 'checkbox', 'radio', 'image', 'file']);

// A focused or filled-in field means a form is in progress. Runs after the route
// change, so it sees the new page plus persistent layout forms (e.g. newsletter).
// Checks for non-empty values: React keeps defaultValue in sync on controlled inputs.
function hasActiveForm(): boolean {
  const active = document.activeElement as HTMLElement | null;
  if (active && (active.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName))) return true;
  const fields = document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
  for (const field of fields) {
    if (field instanceof HTMLInputElement && SKIPPED_INPUT_TYPES.has(field.type)) continue;
    if (field.value.trim() !== '') return true;
  }
  return false;
}

// Applies a pending update on a route change, never into/out of the checkout or
// while a form is in progress; it then waits for a later route change.
export function useApplyUpdateOnNavigation() {
  const { pathname } = useLocation();
  const previous = useRef(pathname);

  useEffect(() => {
    const from = previous.current;
    previous.current = pathname;
    if (from === pathname || !pendingBuild) return;
    if (isCheckout(from) || isCheckout(pathname) || hasActiveForm()) return;
    tryReload(pendingBuild);
  }, [pathname]);
}
