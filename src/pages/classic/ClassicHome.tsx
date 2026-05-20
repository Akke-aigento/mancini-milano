import { Link } from 'react-router-dom';
import { Gem, ShieldCheck, Shirt, Truck } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import ClassicNewsletter from '@/components/classic/ClassicNewsletter';
import classicHero from '@/assets/classic-hero-clean.jpg';
import classicForHim from '@/assets/classic-forhim.jpg';
import classicForHer from '@/assets/classic-forher.jpg';
import classicCatTops from '@/assets/classic-cat-tops.jpg';
import classicCatOuterwear from '@/assets/classic-cat-outerwear.jpg';
import classicCatBottoms from '@/assets/classic-cat-bottoms.jpg';
import classicCatAccessories from '@/assets/classic-cat-accessories.jpg';

const scrollToCollection = (e: React.MouseEvent) => {
  e.preventDefault();
  const el = document.getElementById('classic-collection-showcase');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const ClassicHome = () => {
  return (
    <Layout>
      <SEO
        title="Classic — Refined Italian Essentials"
        description="Mancini Milano Classic. Refined essentials crafted in Italy. Timeless design, premium materials, and uncompromising craftsmanship."
        canonical="https://mancinimilano.com/classic"
      />

      {/* Hero — full-bleed editorial campaign image with code-rendered overlay */}
      <section className="relative w-full overflow-hidden bg-secondary">



        {/* Hero image + overlay */}
        <div className="relative w-full">
          <img
            src={classicHero}
            alt="Mancini Milano Classic campaign — black leather bag, cap, t-shirt and jeans on marble steps"
            className="block w-full h-auto"
            loading="eager"
          />

          {/* Desktop readability gradient — very subtle, wordmark blends with the marble */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none hidden lg:block"
            style={{
              background:
                'linear-gradient(to right, hsl(var(--secondary) / 0.35) 0%, hsl(var(--secondary) / 0.15) 20%, transparent 40%)',
            }}
          />

          {/* Soft fade into the cream background at the bottom (seamless handoff to mobile text block) */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, hsl(var(--secondary)) 100%)',
            }}
          />

          {/* Desktop overlay — wordmark printed on the marble next to the products */}
          <div className="absolute inset-0 hidden lg:flex items-center">
            <div className="max-w-site mx-auto w-full px-6 lg:px-12">
              <div className="max-w-md">
                <h1 className="leading-none">
                  <span
                    className="font-classic font-semibold block text-[88px] xl:text-[120px] leading-[0.95]"
                    style={{
                      color: '#C8A75A',
                      letterSpacing: '0.04em',
                      textShadow:
                        '0 1px 0 rgba(255,220,150,0.4), 0 2px 4px rgba(0,0,0,0.22), 0 -1px 0 rgba(120,80,20,0.45)',
                    }}
                  >
                    MANCINI
                  </span>
                  <span
                    className="block mt-3 text-[16px] xl:text-[22px] font-medium"
                    style={{
                      color: '#C8A75A',
                      letterSpacing: '0.55em',
                      textShadow: '0 1px 1px rgba(0,0,0,0.18)',
                    }}
                  >
                    MILANO
                  </span>
                </h1>
                <p
                  className="font-classic italic text-lg xl:text-xl mt-6"
                  style={{ color: 'rgba(200,167,90,0.85)' }}
                >
                  Timeless style. Made to last.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop body + CTA row — below the photo */}
        <div className="hidden lg:flex max-w-site mx-auto px-6 lg:px-12 pt-8 pb-14 items-center justify-between gap-8">
          <p className="font-classic italic text-lg lg:text-xl text-muted-foreground max-w-xl">
            Refined essentials crafted with premium materials and elevated by gold details. Designed in Italy. Worn everywhere.
          </p>
          <Link
            to="/classic/collections/all"
            onClick={scrollToCollection}
            className="inline-block bg-foreground text-background px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-classic-gold hover:text-background transition-colors duration-300 whitespace-nowrap"
          >
            Shop Collection
          </Link>
        </div>




        {/* Mobile text block — stacked under the image */}
        <div className="lg:hidden max-w-site mx-auto px-6 pt-8 pb-12">
          <h1 className="leading-none">
            <span
              className="font-classic font-semibold block text-[56px] sm:text-[72px] leading-[0.95]"
              style={{
                color: '#C8A75A',
                letterSpacing: '0.04em',
                textShadow:
                  '0 1px 0 rgba(255,220,150,0.35), 0 2px 4px rgba(0,0,0,0.25), 0 -1px 0 rgba(120,80,20,0.4)',
              }}
            >
              MANCINI
            </span>
            <span
              className="block mt-1.5 text-[12px] sm:text-[14px] font-medium"
              style={{
                color: '#C8A75A',
                letterSpacing: '0.55em',
                textShadow: '0 1px 1px rgba(0,0,0,0.15)',
              }}
            >
              MILANO
            </span>
          </h1>
          <p className="font-classic italic text-foreground/80 text-base sm:text-lg mt-4">
            Timeless style. Made to last.
          </p>

          <span aria-hidden className="block w-10 h-px bg-classic-gold mt-5 mb-4" />
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            Refined essentials crafted with premium materials and elevated by gold details. Designed in Italy. Worn everywhere.
          </p>
          <Link
            to="/classic/collections/all"
            onClick={scrollToCollection}
            className="inline-block mt-7 bg-foreground text-background px-10 py-4 text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-classic-gold hover:text-background transition-colors duration-300"
          >
            Shop Collection
          </Link>
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

      {/* THE COLLECTION — For Him / For Her showcase */}
      <section
        id="classic-collection-showcase"
        className="py-24 lg:py-32 px-6 lg:px-12 bg-secondary scroll-mt-20"
      >
        <div className="max-w-site mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] text-classic-gold inline-block">
              The Collection
            </span>
            <h2 className="font-classic font-light text-foreground text-4xl md:text-5xl mt-4">
              Crafted for Him &amp; Her
            </h2>
            <span aria-hidden className="block w-12 h-px bg-classic-gold mx-auto mt-6" />
          </div>

          {/* Primary tiles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {[
              { label: 'For Him', href: '/classic/collections/men', img: classicForHim, alt: 'Mancini Milano Classic — For Him editorial' },
              { label: 'For Her', href: '/classic/collections/women', img: classicForHer, alt: 'Mancini Milano Classic — For Her editorial' },
            ].map(tile => (
              <Link
                key={tile.label}
                to={tile.href}
                className="group relative block overflow-hidden border border-transparent hover:border-classic-gold transition-colors duration-500"
              >
                <div className="relative aspect-[4/5] lg:aspect-[4/5] lg:h-[600px] w-full overflow-hidden bg-background">
                  <img
                    src={tile.img}
                    alt={tile.alt}
                    width={1024}
                    height={1280}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 100%)' }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-8 lg:p-10">
                    <span aria-hidden className="block w-8 h-px bg-classic-gold mb-4 transition-all duration-500 group-hover:w-16" />
                    <p
                      className="font-classic uppercase text-2xl lg:text-3xl font-light"
                      style={{ color: '#F5F0E0', letterSpacing: '0.18em' }}
                    >
                      {tile.label}
                    </p>
                    <p
                      className="mt-2 text-[11px] uppercase tracking-[0.3em] font-medium"
                      style={{ color: '#C8A75A' }}
                    >
                      Shop the edit
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Secondary category strip */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { label: 'Outerwear', slug: 'outerware', img: classicCatOuterwear },
              { label: 'Tops', slug: 'tops', img: classicCatTops },
              { label: 'Bottoms', slug: 'bottoms', img: classicCatBottoms },
              { label: 'Accessories', slug: 'accessories', img: classicCatAccessories },
            ].map(cat => (
              <Link
                key={cat.slug}
                to={`/classic/collections/${cat.slug}`}
                className="group block text-center"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-background">
                  <img
                    src={cat.img}
                    alt={`Mancini Milano Classic — ${cat.label}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 transition-colors duration-500 group-hover:bg-classic-gold/10"
                  />
                </div>
                <div className="pt-4 pb-1">
                  <span className="font-classic text-foreground text-base lg:text-lg inline-block relative">
                    {cat.label}
                    <span
                      aria-hidden
                      className="absolute left-0 right-0 -bottom-1 h-px bg-classic-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"
                    />
                  </span>
                </div>
              </Link>
            ))}
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
