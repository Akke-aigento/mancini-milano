import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useSellQoCart } from '@/integrations/sellqo/CartContext';
import { useCustomerAuth } from '@/integrations/sellqo/CustomerAuthContext';
import { useCategories, useProducts } from '@/integrations/sellqo/hooks';
import SearchOverlay from '@/components/SearchOverlay';
import logoDoberman from '@/assets/logo-doberman.png';

function DropdownMenu({ label, links, slug, scrolled, isHome, linkPrefix }: { label: string; links: { label: string; slug: string }[]; slug: string; scrolled: boolean; isHome: boolean; linkPrefix?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to={`/collections/${slug}`}
        className="flex items-center gap-1 text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        {label}
        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isHome && !scrolled ? 'rotate-180' : ''}`} />
      </Link>
      {open && (
        <div className={`absolute left-0 z-50 ${!isHome || scrolled ? 'top-full pt-2' : 'bottom-full pb-2'}`}>
          <div className="bg-card border border-border min-w-[180px] py-2">
            {links.map(link => (
              <Link
                key={link.slug}
                to={linkPrefix ? `/collections/${link.slug}?gender=${linkPrefix}` : `/collections/${link.slug}`}
                className="block px-5 py-2.5 text-xs uppercase tracking-button text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileAccordion({ label, slug, links, onClose, linkPrefix }: { label: string; slug: string; links: { label: string; slug: string }[]; onClose: () => void; linkPrefix?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          to={`/collections/${slug}`}
          onClick={onClose}
          className="block py-3 text-base uppercase tracking-button font-medium text-foreground min-h-[44px] flex items-center"
        >
          {label}
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {open && (
        <div className="pl-4 pb-2 space-y-1">
          {links.map(l => (
            <Link
              key={l.slug}
              to={linkPrefix ? `/collections/${l.slug}?gender=${linkPrefix}` : `/collections/${l.slug}`}
              onClick={onClose}
              className="block py-2.5 text-sm uppercase tracking-button text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Fallback hardcoded links in case API categories haven't loaded yet

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useCustomerAuth();
  const { itemCount, openCart } = useSellQoCart();
  const { data: categories } = useCategories();
  const { data: menProducts } = useProducts({ category_slug: 'men' });
  const { data: womenProducts } = useProducts({ category_slug: 'women' });
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Build gender-aware dropdown links from actual product categories
  const forHimLinks = useMemo(() => {
    if (!menProducts || menProducts.length === 0) return [];
    const catMap = new Map<string, { label: string; slug: string; position: number }>();
    menProducts.forEach(p => {
      (p.categories || []).forEach(c => {
        if (c.slug !== 'men' && c.slug !== 'for-him') {
          catMap.set(c.slug, { label: c.name, slug: c.slug, position: c.position ?? 999 });
        }
      });
    });
    return Array.from(catMap.values()).sort((a, b) => a.position - b.position);
  }, [menProducts]);

  const forHerLinks = useMemo(() => {
    if (!womenProducts || womenProducts.length === 0) return [];
    const catMap = new Map<string, { label: string; slug: string; position: number }>();
    womenProducts.forEach(p => {
      (p.categories || []).forEach(c => {
        if (c.slug !== 'women' && c.slug !== 'for-her') {
          catMap.set(c.slug, { label: c.name, slug: c.slug, position: c.position ?? 999 });
        }
      });
    });
    return Array.from(catMap.values()).sort((a, b) => a.position - b.position);
  }, [womenProducts]);

  // "All" dropdown: all categories with products, excluding parent containers
  const parentSlugsToExclude = ['for-him', 'for-her', 'men', 'women'];
  const allLinks = categories
    ? categories
        .filter((c: any) => (c.product_count ?? 0) > 0 && !parentSlugsToExclude.includes(c.slug))
        .sort((a: any, b: any) => (a.position ?? 999) - (b.position ?? 999))
        .map((c: any) => ({ label: c.name, slug: c.slug }))
    : [];

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-site mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
          <Link to="/" className="relative h-10 w-[160px] flex items-center">
            <span className={`absolute font-heading text-lg tracking-logo uppercase text-foreground transition-all duration-700 ease-in-out ${scrolled || !isHome ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              Mancini Milano
            </span>
            <img
              src={logoDoberman}
              alt="Mancini Milano"
              className={`absolute h-9 w-auto object-contain transition-all duration-700 ease-in-out ${scrolled || !isHome ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            {allLinks.length > 0 && (
              <DropdownMenu label="All" links={allLinks} slug="all" scrolled={scrolled} isHome={isHome} />
            )}
            {forHimLinks.length > 0 ? (
              <DropdownMenu label="For Him" links={forHimLinks} slug="men" scrolled={scrolled} isHome={isHome} linkPrefix="men" />
            ) : menProducts && menProducts.length > 0 ? (
              <Link to="/collections/men" className="text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-primary transition-colors">
                For Him
              </Link>
            ) : null}
            {forHerLinks.length > 0 ? (
              <DropdownMenu label="For Her" links={forHerLinks} slug="women" scrolled={scrolled} isHome={isHome} linkPrefix="women" />
            ) : womenProducts && womenProducts.length > 0 ? (
              <Link to="/collections/women" className="text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-primary transition-colors">
                For Her
              </Link>
            ) : null}
            <Link to="/collections/fragrances" className="text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-primary transition-colors">
              Fragrances
            </Link>
            <Link to="/contact" className="text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              to={isAuthenticated ? "/account" : "/login"}
              className="min-w-[44px] min-h-[44px] items-center justify-center text-muted-foreground hover:text-foreground transition-colors hidden sm:flex"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              onClick={openCart}
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-background lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link to="/" onClick={closeMobile} className="font-heading text-lg tracking-logo uppercase text-foreground">
              Mancini Milano
            </Link>
            <button
              onClick={closeMobile}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="px-6 py-4 overflow-y-auto h-[calc(100vh-64px)]">
            <Link to="/" onClick={closeMobile} className="block py-3 text-base uppercase tracking-button font-medium text-foreground min-h-[44px] flex items-center">
              Home
            </Link>
            {allLinks.length > 0 && (
              <MobileAccordion label="All" slug="all" links={allLinks} onClose={closeMobile} />
            )}
            {forHimLinks.length > 0 ? (
              <MobileAccordion label="For Him" slug="men" links={forHimLinks} onClose={closeMobile} linkPrefix="men" />
            ) : menProducts && menProducts.length > 0 ? (
              <Link to="/collections/men" onClick={closeMobile} className="block py-3 text-base uppercase tracking-button font-medium text-foreground min-h-[44px] flex items-center">
                For Him
              </Link>
            ) : null}
            {forHerLinks.length > 0 ? (
              <MobileAccordion label="For Her" slug="women" links={forHerLinks} onClose={closeMobile} linkPrefix="women" />
            ) : womenProducts && womenProducts.length > 0 ? (
              <Link to="/collections/women" onClick={closeMobile} className="block py-3 text-base uppercase tracking-button font-medium text-foreground min-h-[44px] flex items-center">
                For Her
              </Link>
            ) : null}
            <Link to="/collections/fragrances" onClick={closeMobile} className="block py-3 text-base uppercase tracking-button font-medium text-foreground min-h-[44px] flex items-center">
              Fragrances
            </Link>
            <Link to="/contact" onClick={closeMobile} className="block py-3 text-base uppercase tracking-button font-medium text-foreground min-h-[44px] flex items-center">
              Contact
            </Link>

            <div className="border-t border-border mt-6 pt-6 space-y-1">
              <Link to="/about" onClick={closeMobile} className="block py-2.5 text-sm text-muted-foreground min-h-[44px] flex items-center">About Us</Link>
              <Link to="/faq" onClick={closeMobile} className="block py-2.5 text-sm text-muted-foreground min-h-[44px] flex items-center">FAQ</Link>
              <Link to="/size-guide" onClick={closeMobile} className="block py-2.5 text-sm text-muted-foreground min-h-[44px] flex items-center">Size Guide</Link>
            </div>
          </div>
        </div>
      )}

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
