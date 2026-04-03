import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle, CreditCard, Building2, QrCode, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useSellQoCart } from '@/integrations/sellqo/CartContext';
import { checkoutAPI } from '@/integrations/sellqo/api';
import { formatPrice } from '@/components/ProductCard';

const CheckoutSuccess = () => {
  const { clearCart } = useSellQoCart();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const state = location.state as {
    orderNumber?: string;
    total?: number;
    currency?: string;
    bankDetails?: Record<string, string>;
    qrData?: { image_url?: string; payload?: string };
    paymentType?: 'redirect' | 'manual' | 'qr';
  } | null;

  const sessionId = searchParams.get('session_id');
  const paymentType = state?.paymentType || (sessionId ? 'redirect' : 'manual');

  const [isPolling, setIsPolling] = useState(!!sessionId);
  const [orderData, setOrderData] = useState<{ order_number: string; total: number; currency: string } | null>(null);
  const [showGenericThankYou, setShowGenericThankYou] = useState(false);

  const pollForOrder = useCallback(async (sid: string, attempts = 0) => {
    try {
      const res = await checkoutAPI.getOrderBySession(sid);
      const data = res as any;
      const result = data?.data || data;
      if (result?.order_number) {
        setOrderData({ order_number: result.order_number, total: result.total, currency: result.currency });
        clearCart();
        setIsPolling(false);
        return;
      }
    } catch { /* webhook may not have fired yet */ }

    if (attempts < 5) {
      setTimeout(() => pollForOrder(sid, attempts + 1), 2000);
    } else {
      setShowGenericThankYou(true);
      clearCart();
      setIsPolling(false);
    }
  }, [clearCart]);

  useEffect(() => {
    if (sessionId) {
      pollForOrder(sessionId);
    } else {
      // Non-Stripe: cart already cleared before navigating here
    }
  }, [sessionId, pollForOrder]);

  if (isPolling) {
    return (
      <Layout>
        <section className="max-w-site mx-auto px-4 lg:px-8 py-20 lg:py-32 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-6" />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </section>
      </Layout>
    );
  }

  const displayOrderNumber = state?.orderNumber || orderData?.order_number;
  const displayTotal = state?.total || orderData?.total;

  return (
    <Layout>
      <section className="max-w-site mx-auto px-4 lg:px-8 py-20 lg:py-32 text-center">
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="font-heading text-3xl lg:text-4xl tracking-heading uppercase text-foreground mb-4">
          Thank You for Your Order
        </h1>

        {displayOrderNumber && (
          <p className="text-sm text-muted-foreground mb-2">
            Order number: <span className="font-medium text-foreground">{displayOrderNumber}</span>
          </p>
        )}

        {/* Stripe / redirect */}
        {paymentType === 'redirect' && (
          <div className="max-w-md mx-auto mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Payment Received</span>
            </div>
            <p className="text-muted-foreground text-base">
              {showGenericThankYou
                ? 'Your order has been placed. You will receive a confirmation email shortly.'
                : 'Your payment has been processed successfully. We\'ll send you a confirmation email with tracking details shortly.'}
            </p>
          </div>
        )}

        {/* Bank transfer / manual */}
        {paymentType === 'manual' && state?.bankDetails && (
          <div className="max-w-md mx-auto mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Bank Transfer</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Please transfer the amount to the following account. Your order will be processed once payment is received.
            </p>
            <div className="border border-border p-5 text-left space-y-2 bg-card">
              {displayTotal && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium text-foreground">{formatPrice(displayTotal)}</span>
                </div>
              )}
              {Object.entries(state.bankDetails).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="font-medium text-foreground font-mono text-xs">{value}</span>
                </div>
              ))}
              {displayOrderNumber && (
                <div className="flex justify-between text-sm border-t border-border pt-2 mt-2">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-medium text-foreground">{displayOrderNumber}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manual without bank details (fallback) */}
        {paymentType === 'manual' && !state?.bankDetails && (
          <div className="max-w-md mx-auto mb-10">
            <p className="text-muted-foreground text-base">
              Your order has been confirmed. We'll send you a confirmation email with further details shortly.
            </p>
          </div>
        )}

        {/* QR payment */}
        {paymentType === 'qr' && (state?.qrData || state?.qr_data) && (() => {
          const qr = state?.qrData || state?.qr_data;
          const qrImageUrl = qr?.image_url || qr?.qr_image_url;
          return (
          <div className="max-w-md mx-auto mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <QrCode className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Scan de QR code om te betalen</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Open je bankapp, kies 'QR code scannen', en bevestig de betaling.
              Je ontvangt een bevestiging per email zodra de betaling is ontvangen.
            </p>
            {qrImageUrl && (
              <div className="flex justify-center mb-4">
                <img src={qrImageUrl} alt="Betaal QR code" className="w-64 h-64 border-2 border-border rounded-lg p-2 bg-white" />
              </div>
            )}
            {displayTotal && (
              <p className="text-lg font-medium text-foreground mb-2">{formatPrice(displayTotal)}</p>
            )}
            {displayOrderNumber && (
              <p className="text-sm text-muted-foreground">Bestelnummer: {displayOrderNumber}</p>
            )}
          </div>
          );
        })()}

        {!state?.bankDetails && !state?.qrData && paymentType !== 'redirect' && (
          <p className="text-sm text-muted-foreground mb-10">
            Expected delivery: 3–7 business days worldwide.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-block border border-foreground text-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            to="/contact"
            className="inline-block border border-border text-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:border-foreground/30 transition-colors"
          >
            Need Help?
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutSuccess;
