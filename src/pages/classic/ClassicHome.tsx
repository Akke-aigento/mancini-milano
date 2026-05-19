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

      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-background" style={{ minHeight: '70vh' }}>
        <img
          src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=2000&q=80"
          alt="Mancini Milano Classic — refined Italian tailoring"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-32 lg:py-44" style={{ minHeight: '70vh' }}>
          <span className="text-[10px] lg:text-[11px] uppercase tracking-[0.5em] text-classic-gold mb-8">
            Mancini Milano Classic
          </span>
          <h1 className="font-classic font-light text-foreground text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[1.05] mb-6 max-w-4xl">
            Refined Essentials
          </h1>
          <span aria-hidden className="block w-16 h-px bg-classic-gold mb-8" />
          <p className="font-classic text-xl md:text-2xl text-foreground/80 italic font-light mb-12 max-w-xl">
            Crafted in Italy. Designed to last.
          </p>
          <Link
            to="/classic/collections/all"
            className="inline-block border border-classic-gold text-classic-gold px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-classic-gold hover:text-background transition-colors duration-300"
          >
            Discover the Collection
          </Link>
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
