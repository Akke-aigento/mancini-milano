import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useSellQoCart } from '@/integrations/sellqo/CartContext';

const CheckoutSuccess = () => {
  const { clearCart } = useSellQoCart();

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
        <p className="text-muted-foreground text-base max-w-md mx-auto mb-3">
          Your order has been confirmed. We'll send you a confirmation email with tracking details shortly.
        </p>
        <p className="text-sm text-muted-foreground mb-10">
          Expected delivery: 3–7 business days worldwide.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:bg-gold-hover transition-colors"
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
