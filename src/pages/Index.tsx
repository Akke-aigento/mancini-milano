import Layout from '@/components/layout/Layout';

const Index = () => (
  <Layout>
    <section className="max-w-site mx-auto px-4 lg:px-8 py-20 lg:py-32 text-center">
      <h1 className="font-heading text-4xl lg:text-6xl tracking-heading uppercase text-foreground mb-6">
        Mancini Milano
      </h1>
      <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
        Italian luxury streetwear. Elevated essentials for those who move with authority.
      </p>
      <a
        href="/collections/for-him"
        className="inline-block bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:bg-gold-hover transition-colors"
      >
        Shop Now
      </a>
    </section>
  </Layout>
);

export default Index;
