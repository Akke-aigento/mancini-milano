import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import heroDoberman from '@/assets/hero-doberman.png';
import brandBanner from '@/assets/brand-banner.png';
import lookbookBanner from '@/assets/lookbook-banner.jpg';
import Layout from '@/components/layout/Layout';

import SEO from '@/components/SEO';
import { useProducts, useProduct, useCategories, useNewsletterSubscribe } from '@/integrations/sellqo/hooks';
import type { Product } from '@/integrations/sellqo/types';

const categoryImages: Record<string, string> = {
  't-shirts': 'https://mancinimilano.com/cdn/shop/files/rn-image_picker_lib_temp_896ede1b-a149-4125-a1c4-18afec653b26_600x.png?v=1765501528',
  'jackets': 'https://mancinimilano.com/cdn/shop/files/rn-image_picker_lib_temp_af64f79d-1dc6-4c11-a839-4c9df9c40dc1_600x.png?v=1771805413',
  'hoodies': 'https://mancinimilano.com/cdn/shop/files/rn-image_picker_lib_temp_af64f79d-1dc6-4c11-a839-4c9df9c40dc1_600x.png?v=1771805413',
};

const featuredCategorySlugs = ['t-shirts', 'jackets', 'hoodies'];

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price);
}

const Index = () => {
  const { data: trendingProducts = [] } = useProducts({ category_slug: 'trending' });
  const { data: blueStormTee } = useProduct('blue-storm-luxe-tee');
  const { data: silentAuthority } = useProduct('silent-authority');
  const { data: fragrance } = useProduct('mancini-milano');
  const { data: categories = [] } = useCategories();
  const newsletterMutation = useNewsletterSubscribe();
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const featuredCategories = featuredCategorySlugs.map((slug) => {
    const apiCat = categories.find((c: any) => c.slug === slug);
    return {
      id: apiCat?.id || slug,
      name: apiCat?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      slug,
    };
  });

  const blueStormProducts = [blueStormTee, silentAuthority].filter(Boolean) as Product[];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await newsletterMutation.mutateAsync({ email });
      setNewsletterStatus('success');
      setEmail('');
    } catch {
      setNewsletterStatus('error');
    }
  };

  return (
    <Layout>
      
      <SEO />
      {/* SECTION 1: HERO */}
      {/* Mobile Hero */}
      <div className="md:hidden">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={lookbookBanner}
            alt="Mancini Milano Collection"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
        <div className="flex flex-col items-center gap-4 px-6 py-6 bg-background">
          <div className="flex gap-4 w-full max-w-xs">
            <Link
              to="/collections/for-him"
              className="flex-1 text-center border border-foreground text-foreground px-6 py-3 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              Shop Men
            </Link>
            <Link
              to="/collections/for-her"
              className="flex-1 text-center bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-button font-medium hover:bg-gold-hover transition-colors"
            >
              Shop Women
            </Link>
          </div>
          <div className="flex flex-col items-center gap-1 animate-bounce mt-4">
            <span className="text-muted-foreground text-[10px] uppercase tracking-button">Scroll</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Desktop Hero */}
      <section className="relative hidden md:grid md:grid-cols-2 h-[calc(100vh-80px)] min-h-[600px] overflow-hidden">
        <div className="flex flex-col justify-center px-8 lg:px-16 xl:px-24 bg-background">
          <span className="inline-block text-primary text-xs uppercase tracking-button font-medium mb-4">
            New Collection
          </span>
          <h1 className="font-heading text-4xl lg:text-[56px] leading-[1.1] tracking-heading uppercase text-foreground mb-5">
            Define Your Own Legacy
          </h1>
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-8 max-w-md">
            Italian craftsmanship meets modern street authority. Elevated essentials for those who refuse to blend in.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/collections/for-him"
              className="border border-foreground text-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              Shop Men
            </Link>
            <Link
              to="/collections/for-her"
              className="bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:bg-gold-hover transition-colors"
            >
              Shop Women
            </Link>
          </div>
        </div>
        <div className="relative">
          <img
            src={heroDoberman}
            alt="Mancini Milano — Italian luxury streetwear brand illustration featuring signature Doberman design"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce z-10">
          <span className="text-muted-foreground text-[10px] uppercase tracking-button">Scroll</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </section>

      {/* SECTION 2: BRAND STATEMENT */}
      <section className="py-20 lg:py-28">
        <div className="max-w-site mx-auto px-4 lg:px-8 text-center">
          <div className="w-10 h-px bg-primary mx-auto mb-6" />
          <h2 className="font-heading text-2xl lg:text-[28px] tracking-heading text-foreground mb-4 italic">
            Where Italian elegance meets street authority
          </h2>
          <p className="text-muted-foreground text-sm lg:text-base max-w-lg mx-auto leading-relaxed">
            Born in Milano, designed for the world. Every piece is crafted with precision, purpose, and an unwavering commitment to luxury.
          </p>
        </div>
      </section>

      {/* SECTION 3: FEATURED CATEGORIES */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-site mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {featuredCategories.map((cat: any) => (
              <Link
                key={cat.id}
                to={`/collections/${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden block"
              >
                <img
                  src={categoryImages[cat.slug] || ''}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-background/50 group-hover:bg-background/40 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-10">
                  <h3 className="font-heading text-xl lg:text-2xl tracking-heading uppercase text-foreground mb-2">
                    {cat.name}
                  </h3>
                  <span className="text-xs uppercase tracking-button text-primary font-medium group-hover:translate-x-1 transition-transform">
                    Shop Now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND BANNER */}
      <section className="w-full overflow-hidden">
        <div className="block md:hidden">
          <img src={brandBanner} alt="Mancini Milano brand typography" loading="lazy" className="w-full h-auto" />
        </div>
        <div className="hidden md:block lg:hidden h-[300px] overflow-hidden">
          <img src={brandBanner} alt="Mancini Milano brand typography" loading="lazy" className="w-full h-full object-cover object-center" />
        </div>
        <div
          className="hidden lg:block h-[450px] bg-fixed bg-cover bg-center"
          style={{ backgroundImage: `url(${brandBanner})` }}
          role="img"
          aria-label="Mancini Milano brand typography"
        />
      </section>

      {/* SECTION 4: TRENDING NOW */}
      <section className="pb-20 lg:pb-28">
        <div className="max-w-site mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl lg:text-3xl tracking-heading uppercase text-foreground">
              Trending Now
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {trendingProducts.map((product: Product) => (
              <Link key={product.id} to={`/products/${product.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden mb-3 bg-card">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors flex items-center justify-center">
                    <span className="text-xs uppercase tracking-button font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 px-4 py-2">
                      Quick View
                    </span>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1 truncate">{product.title}</h3>
                <p className="text-sm text-primary font-medium">{formatPrice(product.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: SHOP THE LOOK */}
      {blueStormProducts.length > 0 && (
        <section className="pb-20 lg:pb-28">
          <div className="max-w-site mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              <div className="aspect-[4/5] overflow-hidden bg-card">
                <img
                  src="https://mancinimilano.com/cdn/shop/files/rn-image_picker_lib_temp_896ede1b-a149-4125-a1c4-18afec653b26_600x.png?v=1765501528"
                  alt="Blue Storm Collection Lifestyle"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-primary text-xs uppercase tracking-button font-medium mb-3">Shop the Look</span>
                <h2 className="font-heading text-2xl lg:text-3xl tracking-heading uppercase text-foreground mb-6">
                  Blue Storm Collection
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm">
                  Bold tones, premium fabrics. The Blue Storm series is designed for those who move with silent authority.
                </p>
                <div className="space-y-4 mb-8">
                  {blueStormProducts.map((product: Product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      className="flex items-center gap-4 p-3 border border-border hover:border-primary/30 transition-colors group"
                    >
                      <div className="w-16 h-20 overflow-hidden bg-card flex-shrink-0">
                        {product.images?.[0] && (
                          <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">{product.title}</h4>
                        <p className="text-sm text-primary">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/collections/t-shirts"
                  className="inline-block bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:bg-gold-hover transition-colors self-start"
                >
                  Shop Collection →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 6: FRAGRANCE HIGHLIGHT */}
      {fragrance && (
        <section className="py-20 lg:py-28 bg-black">
          <div className="max-w-site mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="text-center lg:text-left">
                <span className="text-primary text-xs uppercase tracking-button font-medium mb-3 block">Exclusive</span>
                <h2 className="font-heading text-3xl lg:text-4xl tracking-heading uppercase text-foreground mb-4">
                  The Signature Fragrance
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md mx-auto lg:mx-0">
                  A fragrance for men who dominate without speaking. Intense. Powerful. Unforgettable. Crafted with bold notes of black pepper, cedarwood, and deep patchouli.
                </p>
                <p className="text-2xl text-primary font-heading mb-8">From {formatPrice(fragrance.price)}</p>
                <Link
                  to={`/products/${fragrance.slug}`}
                  className="inline-block bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:bg-gold-hover transition-colors"
                >
                  Discover →
                </Link>
              </div>
              <div className="flex justify-center">
                <div className="w-72 lg:w-80">
                  {fragrance.images?.[0] && (
                    <img src={fragrance.images[0].url} alt={fragrance.title} className="w-full h-auto object-contain" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 7: NEWSLETTER */}
      <section className="py-20 lg:py-28">
        <div className="max-w-site mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-heading text-2xl lg:text-3xl tracking-heading uppercase text-foreground mb-3">
            Join the Movement
          </h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
            Be the first to know about new drops, exclusive offers, and behind-the-scenes content.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 bg-card border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:bg-gold-hover transition-colors"
            >
              Subscribe
            </button>
          </form>
          {newsletterStatus === 'success' && (
            <p className="text-primary text-sm mt-4">Welcome to the movement. You're in.</p>
          )}
          {newsletterStatus === 'error' && (
            <p className="text-destructive text-sm mt-4">Something went wrong. Please try again.</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
