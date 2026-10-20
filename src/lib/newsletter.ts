// Shared mapping of the SellQo `newsletter_subscribe` result to the text shown
// to the visitor (double opt-in). The proxy passes the storefront response
// through unchanged, so the payload is `{ success, data: { requires_confirmation, message } }`.

export type NewsletterOutcome = 'confirm' | 'already' | 'subscribed';

/** 2-letter code of the active UI language (the site is English-only). */
export function getNewsletterLanguage(): string {
  const lang = typeof document !== 'undefined' ? document.documentElement.lang : '';
  return (lang || 'en').slice(0, 2).toLowerCase();
}

export function getNewsletterOutcome(response: unknown): NewsletterOutcome {
  const r = (response && typeof response === 'object' ? response : {}) as Record<string, unknown>;
  const data = (r.data && typeof r.data === 'object' ? r.data : r) as Record<string, unknown>;
  if (data.requires_confirmation === true) return 'confirm';
  if (data.requires_confirmation === false && data.message === 'Already subscribed') return 'already';
  return 'subscribed';
}

export const NEWSLETTER_TEXTS = {
  confirm: 'Almost there — please check your inbox and confirm your subscription via the link in the email.',
  already: 'You are already subscribed to our newsletter.',
};
