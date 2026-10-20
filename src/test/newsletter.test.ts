import { describe, it, expect } from 'vitest';
import { getNewsletterOutcome } from '@/lib/newsletter';

describe('getNewsletterOutcome', () => {
  it('requires_confirmation true → confirm', () => {
    expect(getNewsletterOutcome({ success: true, data: { requires_confirmation: true, message: 'Please check your email to confirm' } })).toBe('confirm');
  });
  it('requires_confirmation false + "Already subscribed" → already', () => {
    expect(getNewsletterOutcome({ success: true, data: { requires_confirmation: false, message: 'Already subscribed' } })).toBe('already');
  });
  it('requires_confirmation false + other message → subscribed', () => {
    expect(getNewsletterOutcome({ success: true, data: { requires_confirmation: false, message: 'Subscribed' } })).toBe('subscribed');
  });
});
