import { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { useSellQoCart } from '@/integrations/sellqo/CartContext';
import { checkoutAPI } from '@/integrations/sellqo/api';

interface OrderData {
  order_number: string;
  total: number;
  currency: string;
  payment_method?: string;
  payment_status?: string;
  shipping_address?: {
    first_name?: string;
    last_name?: string;
    street?: string;
    house_number?: string;
    city?: string;
    zip?: string;
    country?: string;
  };
}

const CheckoutSuccess = () => {
  const { clearCart } = useSellQoCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [isPolling, setIsPolling] = useState(true);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [hasError, setHasError] = useState(false);
  const pollingRef = useRef(false);

  const pollForOrder = useCallback(async (sid: string) => {
    if (pollingRef.current) return;
    pollingRef.current = true;

    let attempts = 0;
    const maxAttempts = 15;
    const interval = 2000;

    const poll = async () => {
      attempts++;
      if (attempts > maxAttempts) {
        setHasError(true);
        clearCart();
        setIsPolling(false);
        return;
      }

      try {
        const res = await checkoutAPI.getOrderBySession(sid);
        const raw = res as any;

        // Handle both { success: true, data: { ... } } and flat { order_number: ... }
        const success = raw?.success !== false;
        const data = raw?.data || raw;

        if (success && data?.order_number) {
          setOrderData({
            order_number: data.order_number,
            total: data.total,
            currency: data.currency || 'EUR',
            payment_method: data.payment_method,
            payment_status: data.payment_status,
            shipping_address: data.shipping_address,
          });
          clearCart();
          setIsPolling(false);
          return;
        }

        if (raw?.success === false) {
          setHasError(true);
          clearCart();
          setIsPolling(false);
          return;
        }
      } catch {
        // webhook may not have fired yet — keep polling
      }

      setTimeout(poll, interval);
    };

    poll();
  }, [clearCart]);

  useEffect(() => {
    if (sessionId) {
      pollForOrder(sessionId);
    } else {
      clearCart();
      setIsPolling(false);
    }
  }, [sessionId, pollForOrder, clearCart]);

  if (isPolling) {
    return (
      <Layout>
        <section className="max-w-site mx-auto px-4 lg:px-8 py-20 lg:py-32 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto mb-6" />
          <p className="text-muted-foreground">Betaling verifiëren...</p>
        </section>
      </Layout>
    );
  }

  if (hasError) {
    return (
      <Layout>
        <section className="max-w-site mx-auto px-4 lg:px-8 py-20 lg:py-32 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
          <h1 className="font-heading text-3xl lg:text-4xl tracking-heading uppercase text-foreground mb-4">
            Er is iets misgegaan
          </h1>
          <p className="text-muted-foreground text-base mb-8">
            We konden je betaling niet verifiëren. Neem contact met ons op als het bedrag is afgeschreven.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-block border border-foreground text-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              Contact opnemen
            </Link>
            <Link
              to="/"
              className="inline-block border border-border text-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:border-foreground/30 transition-colors"
            >
              Terug naar shop
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency }).format(amount);
  };

  const addr = orderData?.shipping_address;

  return (
    <Layout>
      <SEO title="Order Confirmed" noindex />
      <section className="max-w-site mx-auto px-4 lg:px-8 py-20 lg:py-32 text-center">
        <h1 className="font-heading text-3xl lg:text-4xl tracking-heading uppercase text-foreground mb-4">
          Bedankt voor je bestelling
        </h1>

        {orderData && (
          <div className="max-w-sm mx-auto text-left border border-border p-6 mb-10 space-y-3">
            {orderData.order_number && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bestelnummer</span>
                <span className="font-medium text-foreground">{orderData.order_number}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Totaal</span>
              <span className="font-medium text-foreground">
                {formatCurrency(orderData.total, orderData.currency)}
              </span>
            </div>
            {orderData.payment_method && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Betaalmethode</span>
                <span className="font-medium text-foreground capitalize">{orderData.payment_method}</span>
              </div>
            )}
            {addr && (addr.street || addr.city) && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Verzendadres</p>
                <p className="text-sm text-foreground">
                  {[addr.first_name, addr.last_name].filter(Boolean).join(' ')}
                </p>
                <p className="text-sm text-foreground">
                  {[addr.street, addr.house_number].filter(Boolean).join(' ')}
                </p>
                <p className="text-sm text-foreground">
                  {[addr.zip, addr.city].filter(Boolean).join(' ')}
                </p>
              </div>
            )}
          </div>
        )}

        {!orderData && (
          <p className="text-muted-foreground text-base mb-10 max-w-md mx-auto">
            Je betaling is verwerkt. We sturen je een bevestigingsmail met de details van je bestelling.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-block border border-foreground text-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors"
          >
            Terug naar shop
          </Link>
          <Link
            to="/contact"
            className="inline-block border border-border text-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:border-foreground/30 transition-colors"
          >
            Hulp nodig?
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutSuccess;
