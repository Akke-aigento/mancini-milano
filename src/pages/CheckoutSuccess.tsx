import { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useSellQoCart } from '@/integrations/sellqo/CartContext';
import { checkoutAPI } from '@/integrations/sellqo/api';

const CheckoutSuccess = () => {
  const { clearCart } = useSellQoCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [isPolling, setIsPolling] = useState(true);
  const [orderData, setOrderData] = useState<{ order_number: string; total: number; currency: string } | null>(null);
  const [hasError, setHasError] = useState(false);
  const pollingRef = useRef(false);

  const pollForOrder = useCallback(async (sid: string) => {
    if (pollingRef.current) return;
    pollingRef.current = true;
    const startTime = Date.now();
    const maxDuration = 30000; // 30 seconds
    const interval = 1000; // 1 second

    const poll = async () => {
      if (Date.now() - startTime > maxDuration) {
        setHasError(true);
        clearCart();
        setIsPolling(false);
        return;
      }

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

      setTimeout(poll, interval);
    };

    poll();
  }, [clearCart]);

  useEffect(() => {
    if (sessionId) {
      pollForOrder(sessionId);
    } else {
      // No session ID — show generic confirmation
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

  return (
    <Layout>
      <section className="max-w-site mx-auto px-4 lg:px-8 py-20 lg:py-32 text-center">
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="font-heading text-3xl lg:text-4xl tracking-heading uppercase text-foreground mb-4">
          Bedankt voor je bestelling
        </h1>

        {orderData?.order_number && (
          <p className="text-sm text-muted-foreground mb-2">
            Bestelnummer: <span className="font-medium text-foreground">{orderData.order_number}</span>
          </p>
        )}

        <p className="text-muted-foreground text-base mb-10 max-w-md mx-auto">
          Je betaling is verwerkt. We sturen je een bevestigingsmail met de details van je bestelling.
        </p>

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
