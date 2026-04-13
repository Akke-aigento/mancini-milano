import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Tag, X, ChevronLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useSellQoCart } from '@/integrations/sellqo/CartContext';
import { useCheckout } from '@/integrations/sellqo/CheckoutContext';
import { checkoutAPI, cartAPI } from '@/integrations/sellqo/api';
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

  useEffect(() => {
    const init = async () => {
      const cartId = localStorage.getItem('mancini_cart_id');
      if (!cartId || cartItems.length === 0) {
        navigate('/cart');
        return;
      }
      try {
        const data = await initCheckout(cartId);
        // Auto-select first shipping
        if (data.available_shipping_methods?.length) {
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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Cart items */}
          <div className="space-y-6">
            <h2 className="text-sm uppercase tracking-button font-medium text-foreground">Jouw bestelling</h2>
            <div className="divide-y divide-border">
              {displayItems.map(item => (
                <div key={item.id} className="flex gap-4 py-4">
                  {(item as any).image && (
                    <div className="w-16 h-20 bg-card overflow-hidden flex-shrink-0">
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
              className="w-full border border-foreground text-foreground py-3.5 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-2"
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
                {checkoutData?.shipping_cost != null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verzending</span>
                    <span className="text-foreground">{checkoutData.shipping_cost > 0 ? formatPrice(checkoutData.shipping_cost) : 'Gratis'}</span>
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
