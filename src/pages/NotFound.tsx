import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';

const NotFound = () => (
  <Layout>
    <SEO title="Page Not Found" />
    <section className="max-w-site mx-auto px-4 lg:px-8 py-20 lg:py-32 text-center">
      <h1 className="font-heading text-5xl lg:text-7xl tracking-heading uppercase text-foreground mb-4">404</h1>
      <p className="font-heading text-xl lg:text-2xl tracking-heading uppercase text-foreground mb-3">
        Page Not Found
      </p>
      <p className="text-sm text-muted-foreground mb-10 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/streetwear"
        className="inline-block bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:bg-gold-hover transition-colors"
      >
        Back to Home
      </Link>
    </section>
  </Layout>
);

export default NotFound;
