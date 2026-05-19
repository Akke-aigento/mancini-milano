import { Link } from 'react-router-dom';
import { Gem, ShieldCheck, Shirt, Truck } from 'lucide-react';
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
          <div className="order-1 lg:order-2 relative w-full aspect-[4/5] overflow-hidden bg-secondary">
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1400&q=80"
              alt="Mancini Milano Classic — refined Italian tailoring"
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
            />
            {/* Soft fade into the light background on all edges */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, hsl(var(--secondary)) 0%, transparent 18%, transparent 82%, hsl(var(--secondary)) 100%), linear-gradient(to right, hsl(var(--secondary)) 0%, transparent 14%, transparent 86%, hsl(var(--secondary)) 100%)',
              }}
            />
          </div>
        </div>
      </section>


      {/* Gold value-props strip (light) */}
      <section className="border-y border-classic-gold/30 bg-secondary">
        <div className="max-w-site mx-auto px-6 lg:px-12 py-6 grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
          {[
            { icon: Gem, title: 'Premium Quality', sub: 'Finest materials' },
            { icon: ShieldCheck, title: 'Built To Last', sub: 'Durable & reliable' },
            { icon: Shirt, title: 'Italian Design', sub: 'Made in Italy' },
            { icon: Truck, title: 'Free Shipping', sub: 'Orders over €150' },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 lg:justify-center">
              <Icon className="h-5 w-5 text-classic-gold flex-shrink-0" strokeWidth={1.25} />
              <div className="leading-tight">
                <p className="text-[11px] uppercase tracking-[0.18em] text-foreground font-medium">{title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand story strip */}
      <section className="py-24 lg:py-32 px-6 bg-background">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.4em] text-classic-gold inline-block">
            Our Collection
          </span>
          <h2 className="font-classic font-light text-foreground text-4xl md:text-5xl mt-4">
            Refined Essentials
          </h2>
          <span aria-hidden className="block w-12 h-px bg-classic-gold mx-auto mt-6" />
        </div>
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
              <span className="font-classic text-classic-gold text-3xl lg:text-4xl italic font-light mb-4">
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

      {/* SIGNATURE DETAILS — dark gold-on-black band */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-site mx-auto grid grid-cols-1 lg:grid-cols-2 items-stretch">
          {/* Left: embroidered gold wordmark on black */}
          <div
            className="relative flex items-center justify-center px-8 py-20 lg:py-32 min-h-[320px] lg:min-h-[520px]"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 30% 40%, rgba(200,167,90,0.10), transparent 60%), linear-gradient(135deg, #0d0d0d 0%, #050505 100%)',
            }}
          >
            <div className="text-center">
              <p
                className="font-classic font-semibold leading-none text-[64px] sm:text-[88px] lg:text-[112px]"
                style={{
                  color: '#C8A75A',
                  letterSpacing: '0.04em',
                  textShadow:
                    '0 1px 0 rgba(255,220,150,0.25), 0 2px 4px rgba(0,0,0,0.6), 0 -1px 0 rgba(120,80,20,0.5)',
                }}
              >
                MANCINI
              </p>
              <p
                className="mt-2 text-[14px] sm:text-[18px] lg:text-[22px] font-medium"
                style={{
                  color: '#C8A75A',
                  letterSpacing: '0.55em',
                  textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                }}
              >
                MILANO
              </p>
            </div>
          </div>

          {/* Right: copy */}
          <div className="flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-32 text-left">
            <span className="text-[10px] uppercase tracking-[0.5em] text-classic-gold mb-6">
              Signature Details
            </span>
            <h2
              className="font-classic font-light text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-6"
              style={{ color: '#F5F0E0' }}
            >
              Gold is in
              <br />
              our nature.
            </h2>
            <span aria-hidden className="block w-12 h-px bg-classic-gold mb-8" />
            <p
              className="text-base lg:text-lg leading-relaxed max-w-md mb-10"
              style={{ color: 'rgba(245,240,224,0.7)' }}
            >
              From gold embroidery to premium hardware, every detail is crafted
              to elevate the everyday.
            </p>
            <Link
              to="/classic/collections/all"
              className="self-start inline-block bg-classic-gold text-background px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-classic-gold-soft transition-colors duration-300"
            >
              Discover More
            </Link>
          </div>
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
    </Layout>
  );
};

export default ClassicHome;
