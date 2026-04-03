import { useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle, CreditCard, Building2, QrCode } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useSellQoCart } from '@/integrations/sellqo/CartContext';
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

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <Layout>
      <section className="max-w-site mx-auto px-4 lg:px-8 py-20 lg:py-32 text-center">
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="font-heading text-3xl lg:text-4xl tracking-heading uppercase text-foreground mb-4">
          Thank You for Your Order
        </h1>

        {state?.orderNumber && (
          <p className="text-sm text-muted-foreground mb-2">
            Order number: <span className="font-medium text-foreground">{state.orderNumber}</span>
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
              Your payment has been processed successfully. We'll send you a confirmation email with tracking details shortly.
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
              {state.total && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium text-foreground">{formatPrice(state.total)}</span>
                </div>
              )}
              {Object.entries(state.bankDetails).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="font-medium text-foreground font-mono text-xs">{value}</span>
                </div>
              ))}
              {state.orderNumber && (
                <div className="flex justify-between text-sm border-t border-border pt-2 mt-2">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-medium text-foreground">{state.orderNumber}</span>
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
        {paymentType === 'qr' && state?.qrData && (
          <div className="max-w-md mx-auto mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <QrCode className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Scan to Pay</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Scan the QR code below with your banking app to complete the payment.
            </p>
            {state.qrData.image_url && (
              <div className="flex justify-center mb-4">
                <img src={state.qrData.image_url} alt="Payment QR Code" className="w-48 h-48" />
              </div>
            )}
            {state.total && (
              <p className="text-lg font-medium text-foreground mb-2">{formatPrice(state.total)}</p>
            )}
          </div>
        )}

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
