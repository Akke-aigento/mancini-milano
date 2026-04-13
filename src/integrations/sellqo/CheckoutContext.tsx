import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { checkoutAPI } from './api';

/** Shape returned by every checkout_* action from SellQo */
export interface CheckoutCartDisplay {
  order_id?: string;
  items: Array<{
    id: string;
    title: string;
    variant_title?: string;
    quantity: number;
    price: number;
    line_total?: number;
    image?: string;
  }>;
  subtotal: number;
  discount_total?: number;
  applied_discounts?: Array<{ code: string; amount: number }>;
    shipping_cost?: number;
    shipping_display_state?: 'not_calculated' | 'free' | 'charged';
    fee?: number | null;
    fee_label?: string;
    total: number;
    payment_method?: string | null;
    currency?: string;
    pass_fee_to_customer?: boolean;
    available_payment_methods?: Array<{
    method: string;
    group: 'direct' | 'later' | 'transfer';
    name: string;
    description?: string;
    fee_cents?: number;
    available: boolean;
    reason_unavailable?: string | null;
  }>;
  available_shipping_methods?: Array<{
    id: string;
    name: string;
    price: number;
    estimated_days?: string;
  }>;
  payment_section_order?: ('direct' | 'later' | 'transfer')[];
}

interface CheckoutContextType {
  /** The latest cart display object from SellQo. null = not yet loaded. */
  checkoutData: CheckoutCartDisplay | null;
  /** Replace the entire checkout state with fresh API data */
  setCheckoutData: (data: CheckoutCartDisplay) => void;
  /** Convenience: call an API endpoint, then update context with the response */
  updateFromResponse: (response: unknown) => CheckoutCartDisplay;
  /** Whether the initial checkout/start has been called */
  isInitialized: boolean;
  /** Initialize checkout by calling /checkout start */
  initCheckout: (cartId: string) => Promise<CheckoutCartDisplay>;
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

/** Normalize any API response into a CheckoutCartDisplay, merging with previous state.
 *  Pricing fields (total, fee, subtotal, etc.) are ALWAYS overwritten from the response
 *  when present — the backend is the single source of truth. */
function unwrapCheckoutPayload(raw: unknown): Record<string, any> | null {
  let current = raw as any;

  while (
    current &&
    typeof current === 'object' &&
    'data' in current &&
    current.data &&
    typeof current.data === 'object' &&
    !Array.isArray(current.data)
  ) {
    current = current.data;
  }

  return current && typeof current === 'object' && !Array.isArray(current)
    ? current as Record<string, any>
    : null;
}

function normalizeResponse(raw: unknown, prev: CheckoutCartDisplay | null): CheckoutCartDisplay {
  const data = unwrapCheckoutPayload(raw);
  if (!data) return prev || emptyDisplay();

  // Resolve fee: check 'fee' first, then 'transaction_fee'
  let fee: number | null | undefined;
  if ('fee' in data) {
    fee = data.fee != null ? toNum(data.fee, 0) : null;
  } else if ('transaction_fee' in data) {
    fee = data.transaction_fee != null ? toNum(data.transaction_fee, 0) : null;
  } else {
    fee = prev?.fee;
  }

  return {
    order_id: data.order_id ?? prev?.order_id,
    items: Array.isArray(data.items) ? data.items : (prev?.items ?? []),
    subtotal: 'subtotal' in data ? toNum(data.subtotal, 0) : (prev?.subtotal ?? 0),
    discount_total: 'discount_total' in data ? toNum(data.discount_total, 0) : prev?.discount_total,
    applied_discounts: 'applied_discounts' in data ? data.applied_discounts : prev?.applied_discounts,
    shipping_cost: 'shipping_cost' in data ? toNum(data.shipping_cost, 0) : prev?.shipping_cost,
    shipping_display_state: 'shipping_display_state' in data ? data.shipping_display_state : prev?.shipping_display_state,
    fee,
    fee_label: 'fee_label' in data ? data.fee_label : prev?.fee_label,
    total: 'total' in data ? toNum(data.total, 0) : (prev?.total ?? 0),
    payment_method: 'payment_method' in data ? (data.payment_method ?? null) : prev?.payment_method,
    currency: data.currency ?? prev?.currency,
    pass_fee_to_customer: 'pass_fee_to_customer' in data ? data.pass_fee_to_customer : prev?.pass_fee_to_customer,
    available_payment_methods: 'available_payment_methods' in data ? data.available_payment_methods : prev?.available_payment_methods,
    available_shipping_methods: 'available_shipping_methods' in data ? data.available_shipping_methods : prev?.available_shipping_methods,
    payment_section_order: 'payment_section_order' in data ? data.payment_section_order : prev?.payment_section_order,
  };
}

function emptyDisplay(): CheckoutCartDisplay {
  return { items: [], subtotal: 0, total: 0 };
}

function toNum(v: unknown, fb: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
}

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [checkoutData, setCheckoutDataState] = useState<CheckoutCartDisplay | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const checkoutDataRef = useRef<CheckoutCartDisplay | null>(null);

  const setCheckoutData = useCallback((data: CheckoutCartDisplay) => {
    const next = { ...data };
    checkoutDataRef.current = next;
    setCheckoutDataState(next);
  }, []);

  const updateFromResponse = useCallback((response: unknown) => {
    const next = { ...normalizeResponse(response, checkoutDataRef.current) };
    checkoutDataRef.current = next;
    setCheckoutDataState(next);
    return next;
  }, []);

  const initCheckout = useCallback(async (cartId: string) => {
    const res = await checkoutAPI.start(cartId);
    const next = { ...normalizeResponse(res, checkoutDataRef.current) };
    checkoutDataRef.current = next;
    setCheckoutDataState(next);
    setIsInitialized(true);
    return next;
  }, []);

  return (
    <CheckoutContext.Provider value={{ checkoutData, setCheckoutData, updateFromResponse, isInitialized, initCheckout }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}
