import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useSellQoCart } from '@/integrations/sellqo/CartContext';
import { checkoutAPI } from '@/integrations/sellqo/api';
import { formatPrice } from '@/components/ProductCard';
import { toast } from 'sonner';

const toFiniteNumber = (value: unknown, fallback: number): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  description?: string;
  fee?: number;
  reason_unavailable?: string;
}

const PAYMENT_LOGOS: Record<string, string> = {
  bancontact: '/payment-logos/bancontact.svg',
  ideal: '/payment-logos/ideal.svg',
  card: '/payment-logos/card.svg',
  klarna: '/payment-logos/klarna.svg',
  bank_transfer: '/payment-logos/qr.svg',
  qr_transfer: '/payment-logos/qr.svg',
};

const SECTION_MAP: Record<string, string> = {
  bancontact: 'direct',
  ideal: 'direct',
  card: 'direct',
  stripe: 'direct',
  klarna: 'later',
  bank_transfer: 'transfer',
  qr_transfer: 'transfer',
};

const SECTION_LABELS: Record<string, string> = {
  direct: 'Direct betalen',
  later: 'Achteraf betalen',
  transfer: 'Overschrijving',
};

const SECTION_ORDER = ['direct', 'later', 'transfer'];

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items: cartItems, clearCart } = useSellQoCart();
  const isCancelled = searchParams.get('cancelled') === 'true';

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [passFeeToCustomer, setPassFeeToCustomer] = useState(false);
  const [feeLabel, setFeeLabel] = useState('Transactiekosten');

  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [transactionFee, setTransactionFee] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const init = async () => {
      const cartId = localStorage.getItem('mancini_cart_id');
      if (!cartId) {
        navigate('/cart');
        return;
      }
      try {
        const res = await checkoutAPI.start(cartId);
        const data = (res as any)?.data || res;
        setPaymentMethods(data.available_payment_methods || []);
        setPassFeeToCustomer(!!data.pass_fee_to_customer);
        if (data.fee_label) setFeeLabel(data.fee_label);
        setSubtotal(toFiniteNumber(data.subtotal, 0));
        setShippingCost(toFiniteNumber(data.shipping_cost, 0));
        setTotal(toFiniteNumber(data.total, 0));
      } catch (err) {
        console.error('Payment page init error:', err);
        toast.error('Kon betaalmethoden niet laden.');
        navigate('/checkout');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const handleSelectMethod = async (methodId: string) => {
    setSelectedMethod(methodId);
    const cartId = localStorage.getItem('mancini_cart_id');
    if (!cartId) return;
    try {
      const res = await checkoutAPI.selectPaymentMethod(cartId, methodId);
      const data = (res as any)?.data || res;
      setSubtotal(toFiniteNumber(data.subtotal, subtotal));
      setShippingCost(toFiniteNumber(data.shipping_cost, shippingCost));
      setTransactionFee(toFiniteNumber(data.transaction_fee, 0));
      setTotal(toFiniteNumber(data.total, total));
    } catch (err) {
      console.error('Select payment method error:', err);
      // Non-fatal: still allow placing order
    }
  };

  const handleCompleteOrder = async () => {
    if (!selectedMethod) return;
    setIsProcessing(true);
    const cartId = localStorage.getItem('mancini_cart_id');
    if (!cartId) return;

    try {
      const successUrl = `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/checkout/payment?cancelled=true`;

      const res = await checkoutAPI.complete(cartId, selectedMethod, successUrl, cancelUrl);
      const data = res as any;
      const result = data?.data || data;

      if (data?.error || result?.error) {
        const errMsg = data?.error?.message || result?.error?.message || 'Er ging iets mis. Probeer opnieuw.';
        toast.error(errMsg);
        setIsProcessing(false);
        return;
      }

      switch (result.payment_type) {
        case 'redirect':
          window.location.href = result.checkout_url;
          break;
        case 'bank_transfer':
          clearCart();
          if (result.redirect_url) {
            window.location.href = result.redirect_url;
          } else {
            navigate('/bedankt', {
              state: {
                orderNumber: result.order_number,
                total: result.total,
                currency: result.currency,
                bankDetails: result.bank_details,
              },
            });
          }
          break;
        case 'manual':
          clearCart();
          navigate('/bedankt', {
            state: {
              orderNumber: result.order_number,
              total: result.total,
              currency: result.currency,
              bankDetails: result.bank_details,
            },
          });
          break;
        case 'qr':
          clearCart();
          navigate('/bedankt', {
            state: {
              orderNumber: result.order_number,
              total: result.total,
              currency: result.currency,
              bankDetails: result.bank_details,
              qrData: result.qr_data,
            },
          });
          break;
        default:
          if (result.checkout_url) {
            window.location.href = result.checkout_url;
          } else {
            toast.error('Onbekende betaalmethode. Neem contact op.');
          }
      }
    } catch (err: any) {
      console.error('Complete checkout error:', err);
      toast.error(err?.message || 'Kon bestelling niet afronden. Probeer opnieuw.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Group methods by section
  const groupedMethods = useMemo(() => {
    const groups: Record<string, PaymentMethod[]> = {};
    for (const method of paymentMethods) {
      const methodId = method.id || method.type;
      const section = SECTION_MAP[methodId] || 'direct';
      if (!groups[section]) groups[section] = [];
      groups[section].push(method);
    }
    return groups;
  }, [paymentMethods]);

  if (isLoading) {
    return (
      <Layout>
        <section className="max-w-5xl mx-auto px-4 lg:px-8 py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </section>
      </Layout>
    );
  }

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
              <div className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                {i + 1}
              </div>
              <span className="text-xs uppercase tracking-button hidden sm:inline text-foreground">
                {label}
              </span>
              {i < 2 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* Cancelled banner */}
        {isCancelled && (
          <div className="mb-8 border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              Betaling geannuleerd. Kies opnieuw een betaalmethode of probeer opnieuw.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          <div className="space-y-8">
            <h2 className="text-sm uppercase tracking-button font-medium text-foreground">Betaalmethode</h2>

            {SECTION_ORDER.map(sectionKey => {
              const methods = groupedMethods[sectionKey];
              if (!methods || methods.length === 0) return null;
              return (
                <div key={sectionKey} className="space-y-3">
                  <h3 className="text-xs uppercase tracking-button text-muted-foreground font-medium">
                    {SECTION_LABELS[sectionKey]}
                  </h3>
                  {methods.map(method => {
                    const methodId = method.id || method.type;
                    const isSelected = selectedMethod === methodId;
                    const isDisabled = !!method.reason_unavailable;
                    const logoSrc = PAYMENT_LOGOS[methodId];
                    const fee = method.fee ?? 0;
                    const isFree = methodId === 'bank_transfer' || methodId === 'qr_transfer';

                    return (
                      <button
                        key={methodId}
                        onClick={() => !isDisabled && handleSelectMethod(methodId)}
                        disabled={isDisabled}
                        title={isDisabled ? method.reason_unavailable : undefined}
                        className={`w-full flex items-center gap-4 p-4 border transition-colors text-left min-h-[56px] ${
                          isDisabled
                            ? 'opacity-50 cursor-not-allowed border-border'
                            : isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground cursor-pointer'
                        }`}
                      >
                        {/* Logo */}
                        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                          {logoSrc ? (
                            <img src={logoSrc} alt={method.name} className="max-w-full max-h-full object-contain" />
                          ) : (
                            <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground font-medium">
                              {method.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Name + description */}
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-foreground block">{method.name}</span>
                          {method.description && (
                            <span className="text-xs text-muted-foreground block mt-0.5">{method.description}</span>
                          )}
                          {methodId === 'stripe' && (
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5">iDEAL</span>
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5">Bancontact</span>
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5">Creditcard</span>
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5">Apple Pay</span>
                            </div>
                          )}
                        </div>

                        {/* Fee */}
                        {passFeeToCustomer && (
                          <div className="flex-shrink-0 text-right">
                            {isFree ? (
                              <span className="text-xs text-primary font-medium">Gratis</span>
                            ) : fee > 0 ? (
                              <span className="text-xs text-muted-foreground">+ {formatPrice(fee)}</span>
                            ) : null}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => navigate('/checkout/address')}
                className="flex items-center gap-1 px-4 py-3 text-xs uppercase tracking-button font-medium border border-border text-foreground hover:border-muted-foreground transition-colors"
              >
                <ChevronLeft className="h-3 w-3" /> Terug
              </button>
              <button
                onClick={handleCompleteOrder}
                disabled={isProcessing || !selectedMethod}
                className="flex-1 border border-foreground text-foreground py-3.5 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                Bestelling plaatsen
              </button>
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="order-first lg:order-last">
            <div className="border border-border p-5 space-y-4">
              <h3 className="text-sm uppercase tracking-button font-medium text-foreground">Overzicht</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotaal</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verzending</span>
                  <span className="text-foreground">{shippingCost > 0 ? formatPrice(shippingCost) : 'Gratis'}</span>
                </div>
                {passFeeToCustomer && selectedMethod && transactionFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{feeLabel}</span>
                    <span className="text-foreground">{formatPrice(transactionFee)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-2 flex justify-between font-medium">
                  <span>Totaal</span>
                  <span className="text-lg">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutPayment;
