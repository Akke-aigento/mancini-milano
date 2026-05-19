import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import ClassicNewsletter from '@/components/classic/ClassicNewsletter';

const ClassicHome = () => {
  return (
    <Layout>
      <SEO
        title="Classic — Refined Italian Essentials"
        description="Mancini Milano Classic. Refined essentials crafted in Italy. Timeless design, premium materials, and uncompromising craftsmanship."
        canonical="https://mancinimilano.com/classic"
      />

      {/* Hero — light editorial */}
      <section className="relative w-full overflow-hidden bg-secondary" style={{ minHeight: '70vh' }}>
        <div className="max-w-site mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20 px-6 lg:px-12 py-24 lg:py-32" style={{ minHeight: '70vh' }}>
          <div className="flex flex-col items-start text-left order-2 lg:order-1">
            <span className="text-[10px] lg:text-[11px] uppercase tracking-[0.5em] text-classic-gold mb-8">
              Mancini Milano Classic
            </span>
            <h1 className="font-classic font-light text-foreground text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-6">
              Refined Essentials
            </h1>
            <span aria-hidden className="block w-16 h-px bg-classic-gold mb-8" />
            <p className="font-classic text-xl md:text-2xl text-muted-foreground italic font-light mb-12 max-w-md">
              Crafted in Italy. Designed to last.
            </p>
            <Link
              to="/classic/collections/all"
              className="inline-block border border-classic-gold text-classic-gold bg-transparent px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-classic-gold hover:text-background transition-colors duration-300"
            >
              Discover the Collection
            </Link>
          </div>
          <div className="order-1 lg:order-2 w-full aspect-[4/5] overflow-hidden bg-background">
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1400&q=80"
              alt="Mancini Milano Classic — refined Italian tailoring"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>


      {/* Brand story strip */}
      <section className="py-24 lg:py-32 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 text-center">
          {[
            {
              title: 'Italian Design',
              copy: 'Conceived in Milan with a sensibility shaped by generations of craft.',
            },
            {
              title: 'Premium Materials',
              copy: 'Carefully sourced fabrics chosen for their feel, drape and longevity.',
            },
            {
              title: 'Timeless Craft',
              copy: 'Considered construction. Quiet detail. Pieces made to be kept.',
            },
          ].map((item, i) => (
            <div key={item.title} className="flex flex-col items-center">
              <span
                aria-hidden
                className="block w-10 h-px bg-classic-gold mb-6"
              />
              <span className="text-[10px] uppercase tracking-[0.35em] text-classic-gold mb-5">
                0{i + 1}
              </span>
              <h3 className="font-classic text-2xl lg:text-3xl text-foreground font-light mb-4">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {item.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Launch teaser */}
      <section className="py-24 lg:py-36 px-6 bg-secondary">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-classic-gold mb-6 inline-block">
            The Launch
          </span>
          <h2 className="font-classic font-light text-foreground text-4xl md:text-5xl leading-tight mb-6">
            The Classic Collection launches soon.
          </h2>
          <p className="text-base text-muted-foreground mb-10 max-w-md mx-auto">
            Be the first to know. Receive private access to the debut release.
          </p>
          <ClassicNewsletter />
        </div>
      </section>

      {/* Wordmark closer */}
      <section className="py-24 lg:py-32 px-6 text-center">
        <span aria-hidden className="block w-px h-12 bg-classic-gold mx-auto mb-10" />
        <p className="font-classic text-foreground font-light tracking-[0.3em] text-3xl md:text-5xl lg:text-6xl">
          MANCINI MILANO
        </p>
      </section>
    </Layout>
  );
};

export default ClassicHome;
