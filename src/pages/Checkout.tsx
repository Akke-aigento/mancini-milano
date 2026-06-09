import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Tag, X, ChevronLeft, AlertTriangle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { useSellQoCart } from '@/integrations/sellqo/CartContext';
import { useCheckout } from '@/integrations/sellqo/CheckoutContext';
import { checkoutAPI, cartAPI } from '@/integrations/sellqo/api';

import { CART_STORAGE_KEY, markCartOrphaned, storeCartId, createCartIdempotent, sellqoKeys } from '@/integrations/sellqo/hooks';
import { formatPrice } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { items: cartItems } = useSellQoCart();
  const { checkoutData, initCheckout, updateFromResponse } = useCheckout();

  const [isInitializing, setIsInitializing] = useState(true);
  const [discountInput, setDiscountInput] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [checkoutBlocked, setCheckoutBlocked] = useState(false);

  // Reconcile a stale/empty server cart by re-creating it from the local CartContext.
  // Returns the new cart_id on success, or null on failure.
  const reconcileCart = async (staleCartId: string | null): Promise<string | null> => {
    if (!cartItems.length) return null;
    console.warn('[checkout] reconciling cart', { staleCartId, localItemCount: cartItems.length });
    try {
      const cart = await createCartIdempotent();
      const newCartId: string | undefined = cart?.id;
      if (!newCartId) {
        console.error('[checkout] reconcile: createCartIdempotent returned no id', cart);
        return null;
      }
      const results = await Promise.allSettled(
        cartItems.map(it => cartAPI.addItem(newCartId, {
          product_id: it.product_id,
          variant_id: it.variant_id,
          quantity: it.quantity,
        }))
      );
      const failed = results.filter(r => r.status === 'rejected');
      if (failed.length > 0) {
        console.error('[checkout] reconcile: item add failures', { newCartId, failed });
        return null;
      }
      if (staleCartId && staleCartId !== newCartId) markCartOrphaned(staleCartId);
      storeCartId(newCartId);
      console.info('[checkout] reconcile success', { newCartId, items: cartItems.length });
      return newCartId;
    } catch (err) {
      console.error('[checkout] reconcile threw', err);
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      let cartId = localStorage.getItem(CART_STORAGE_KEY);
      if (!cartId) {
        navigate('/cart');
        return;
      }
      try {
        let data = await initCheckout(cartId);

        // Mismatch detection: local cart has items but server cart is empty/short
        const serverCount = data.items?.length ?? 0;
        const localCount = cartItems.length;
        if (localCount > 0 && serverCount < localCount) {
          console.warn('[checkout] cart mismatch detected', { cartId, serverCount, localCount });
          const newCartId = await reconcileCart(cartId);
          if (!newCartId) {
            setCheckoutBlocked(true);
            setIsInitializing(false);
            return;
          }
          cartId = newCartId;
          data = await initCheckout(newCartId);
          if ((data.items?.length ?? 0) === 0) {
            console.error('[checkout] post-reconcile cart still empty');
            setCheckoutBlocked(true);
            setIsInitializing(false);
            return;
          }
        }

        // Only auto-select shipping if none is set yet
        if (data.shipping_cost == null && data.available_shipping_methods?.length) {
          try {
            const shipRes = await checkoutAPI.selectShipping(cartId, data.available_shipping_methods[0].id);
            updateFromResponse(shipRes);
          } catch (e) {
            console.error('Auto-select shipping error:', e);
          }
        }
      } catch (err) {
        console.error('Checkout start error:', err);
        toast.error('Kon checkout niet starten. Probeer opnieuw.');
        navigate('/cart');
      } finally {
        setIsInitializing(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) return;
    const cartId = localStorage.getItem('mancini_cart_id');
    if (!cartId) return;
    const code = discountInput.trim().toUpperCase();
    if (checkoutData?.applied_discounts?.some(d => d.code.toUpperCase() === code)) {
      toast.error('Deze kortingscode is al toegepast');
      return;
    }
    setIsApplyingDiscount(true);
    try {
      await cartAPI.applyDiscount(cartId, code);
      try {
        const res = await checkoutAPI.applyDiscount(cartId, code);
        updateFromResponse(res);
      } catch { /* non-critical */ }
      setDiscountInput('');
      toast.success('Kortingscode toegepast!');
    } catch (err: any) {
      toast.error(err?.message || 'Ongeldige kortingscode');
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = async (codeToRemove: string) => {
    const cartId = localStorage.getItem('mancini_cart_id');
    if (!cartId) return;
    try {
      await cartAPI.removeDiscount(cartId, codeToRemove);
      try {
        const res = await checkoutAPI.removeDiscount(cartId, codeToRemove);
        updateFromResponse(res);
      } catch { /* non-critical */ }
    } catch (err) {
      console.error('Remove discount error:', err);
    }
  };

  if (isInitializing) {
    return (
      <Layout>
        <section className="max-w-5xl mx-auto px-4 lg:px-8 py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </section>
      </Layout>
    );
  }

  const displayItems = checkoutData?.items?.length ? checkoutData.items : cartItems;
  const appliedDiscounts = checkoutData?.applied_discounts ?? [];

  return (
    <Layout>
      <SEO title="Checkout" noindex />
      <section className="max-w-5xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="font-heading text-3xl tracking-heading uppercase text-foreground mb-8 text-center">
          Checkout
        </h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {['Overzicht', 'Gegevens', 'Betaling'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs uppercase tracking-button hidden sm:inline ${
                i === 0 ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {label}
              </span>
              {i < 2 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {checkoutBlocked && (
          <div className="mb-8 border border-destructive/40 bg-destructive/5 p-5 flex gap-4">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-3">
              <p className="text-sm text-foreground font-medium">Winkelwagen kon niet worden gesynchroniseerd</p>
              <p className="text-xs text-muted-foreground">
                Er ging iets mis bij het voorbereiden van je bestelling. Probeer de pagina te herladen of contacteer support als het probleem aanhoudt.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="border border-foreground text-foreground px-4 py-2 text-xs uppercase tracking-button hover:bg-foreground hover:text-background transition-colors"
              >
                Pagina herladen
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Cart items */}
          <div className="space-y-6">
            <h2 className="text-sm uppercase tracking-button font-medium text-foreground">Jouw bestelling</h2>
            <div className="divide-y divide-border">
              {displayItems.map(item => (
                <div key={item.id} className="flex gap-4 py-4">
                  {(item as any).image && (
                    <div className="w-16 h-20 overflow-hidden flex-shrink-0">
                      <img src={(item as any).image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{item.title || 'Product'}</p>
                    {item.variant_title && <p className="text-xs text-muted-foreground">{item.variant_title}</p>}
                    <p className="text-xs text-muted-foreground">Aantal: {item.quantity}</p>
                  </div>
                  <p className="text-sm text-foreground font-medium">{formatPrice((item as any).line_total ?? item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/checkout/address')}
              disabled={checkoutBlocked}
              className="w-full border border-foreground text-foreground py-3.5 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-foreground"
            >
              Doorgaan naar gegevens
            </button>


            <Link
              to="/cart"
              className="flex items-center gap-1 text-xs uppercase tracking-button text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-3 w-3" /> Terug naar winkelwagen
            </Link>
          </div>

          {/* Order summary sidebar */}
          <div className="order-first lg:order-last">
            <div className="border border-border p-5 space-y-4">
              <h3 className="text-sm uppercase tracking-button font-medium text-foreground">Overzicht</h3>

              {/* Discount code */}
              <div className="flex gap-2">
                <Input
                  placeholder="Kortingscode"
                  value={discountInput}
                  onChange={e => setDiscountInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleApplyDiscount()}
                  className="text-sm"
                  disabled={isApplyingDiscount}
                />
                <button
                  onClick={handleApplyDiscount}
                  disabled={!discountInput.trim() || isApplyingDiscount}
                  className="px-4 border border-foreground text-foreground text-xs uppercase tracking-button hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 min-w-[100px] flex items-center justify-center"
                >
                  {isApplyingDiscount ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Toepassen'}
                </button>
              </div>

              {appliedDiscounts.map(d => (
                <div key={d.code} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3 w-3 text-primary" />
                    <span className="text-primary">{d.code}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {d.amount > 0 && <span className="text-primary">-{formatPrice(d.amount)}</span>}
                    <button onClick={() => handleRemoveDiscount(d.code)}><X className="h-3 w-3 text-muted-foreground hover:text-foreground" /></button>
                  </div>
                </div>
              ))}

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotaal</span>
                  <span className="text-foreground">{formatPrice(checkoutData?.subtotal ?? 0)}</span>
                </div>
                {checkoutData?.discount_total != null && checkoutData.discount_total > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Korting</span>
                    <span className="text-primary">-{formatPrice(checkoutData.discount_total)}</span>
                  </div>
                )}
                {checkoutData?.shipping_display_state && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verzending</span>
                    <span className="text-foreground">
                      {checkoutData.shipping_display_state === 'not_calculated' && 'Wordt berekend'}
                      {checkoutData.shipping_display_state === 'free' && 'Gratis'}
                      {checkoutData.shipping_display_state === 'charged' && formatPrice(checkoutData.shipping_cost ?? 0)}
                    </span>
                  </div>
                )}
                <div className="border-t border-border pt-2 flex justify-between font-medium">
                  <span>Totaal</span>
                  <span className="text-lg">{formatPrice(checkoutData?.total ?? 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
