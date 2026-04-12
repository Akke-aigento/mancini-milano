import React, { createContext, useContext, useCallback, useState } from 'react';
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
  }>;
  subtotal: number;
  discount_total?: number;
  applied_discounts?: Array<{ code: string; amount: number }>;
  shipping_cost?: number;
  fee?: number;
  fee_label?: string;
  total: number;
  currency?: string;
  pass_fee_to_customer?: boolean;
  available_payment_methods?: Array<{
    id: string;
    type: string;
    name: string;
    description?: string;
    fee?: number;
    reason_unavailable?: string;
  }>;
  available_shipping_methods?: Array<{
    id: string;
    name: string;
    price: number;
    estimated_days?: string;
  }>;
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

/** Normalize any API response into a CheckoutCartDisplay, merging with previous state */
function normalizeResponse(raw: unknown, prev: CheckoutCartDisplay | null): CheckoutCartDisplay {
  const data = (raw as any)?.data || raw;
  if (!data || typeof data !== 'object') return prev || emptyDisplay();

  return {
    order_id: data.order_id ?? prev?.order_id,
    items: data.items ?? prev?.items ?? [],
    subtotal: toNum(data.subtotal, prev?.subtotal ?? 0),
    discount_total: data.discount_total !== undefined ? toNum(data.discount_total, 0) : prev?.discount_total,
    applied_discounts: data.applied_discounts ?? prev?.applied_discounts,
    shipping_cost: data.shipping_cost !== undefined ? toNum(data.shipping_cost, 0) : prev?.shipping_cost,
    fee: data.fee !== undefined ? toNum(data.fee, 0) : (data.transaction_fee !== undefined ? toNum(data.transaction_fee, 0) : prev?.fee),
    fee_label: data.fee_label ?? prev?.fee_label,
    total: toNum(data.total, prev?.total ?? 0),
    currency: data.currency ?? prev?.currency,
    pass_fee_to_customer: data.pass_fee_to_customer ?? prev?.pass_fee_to_customer,
    available_payment_methods: data.available_payment_methods ?? prev?.available_payment_methods,
    available_shipping_methods: data.available_shipping_methods ?? prev?.available_shipping_methods,
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
  const [checkoutData, setCheckoutData] = useState<CheckoutCartDisplay | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const updateFromResponse = useCallback((response: unknown) => {
    const updated = normalizeResponse(response, checkoutData);
    setCheckoutData(updated);
    return updated;
  }, [checkoutData]);

  const initCheckout = useCallback(async (cartId: string) => {
    const res = await checkoutAPI.start(cartId);
    const updated = normalizeResponse(res, checkoutData);
    setCheckoutData(updated);
    setIsInitialized(true);
    return updated;
  }, [checkoutData]);

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
