import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useSellQoCart } from '@/integrations/sellqo/CartContext';
import { useCustomerAuth } from '@/integrations/sellqo/CustomerAuthContext';
import { useCategories } from '@/integrations/sellqo/hooks';
import { useWorld } from '@/contexts/WorldContext';
import SearchOverlay from '@/components/SearchOverlay';
import logoDoberman from '@/assets/logo-doberman.png';

function DropdownMenu({ label, links, slug, scrolled, isHome }: { label: string; links: { label: string; slug: string }[]; slug: string; scrolled: boolean; isHome: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to={`/streetwear/collections/${slug}`}
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
                to={`/streetwear/collections/${link.slug}`}
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

function MobileAccordion({ label, slug, links, onClose }: { label: string; slug: string; links: { label: string; slug: string }[]; onClose: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 text-base uppercase tracking-button font-medium text-foreground min-h-[44px]"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pl-4 pb-2 space-y-1">
          {links.map(l => (
            <Link
              key={l.slug}
              to={`/streetwear/collections/${l.slug}`}
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
  const location = useLocation();
  const { homeHref } = useWorld();
  const isHome = location.pathname === '/streetwear';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const FIXED_SUBCATEGORIES = [
    { label: 'Jackets', slug: 'jackets' },
    { label: 'Hoodies', slug: 'hoodies' },
    { label: 'T-Shirts', slug: 't-shirts' },
    { label: 'Pants', slug: 'pants' },
    { label: 'Tracksuits', slug: 'tracksuits' },
    { label: 'Bags', slug: 'bags' },
    { label: 'Accessories', slug: 'accessories' },
  ];

  const forHimLinks = FIXED_SUBCATEGORIES;
  const forHerLinks = [
    { label: 'Jackets', slug: 'jackets-women' },
    { label: 'Hoodies', slug: 'hoodies-women' },
    { label: 'T-Shirts', slug: 't-shirts-women' },
    { label: 'Pants', slug: 'pants-women' },
    { label: 'Tracksuits', slug: 'tracksuits-women' },
    { label: 'Bags', slug: 'bags-women' },
    { label: 'Accessories', slug: 'accessories-women' },
  ];


  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-site mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
          {/* Mobile left: hamburger + search */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Logo — centered on mobile, left on desktop */}
          <Link to="/streetwear" className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-auto lg:translate-x-0 h-10 flex items-center">
            <img
              src={logoDoberman}
              alt="Mancini Milano"
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/streetwear" className="text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <DropdownMenu label="For Him" links={forHimLinks} slug="men" scrolled={scrolled} isHome={isHome} />
            <DropdownMenu label="For Her" links={forHerLinks} slug="women" scrolled={scrolled} isHome={isHome} />
            <Link to="/streetwear/collections/fragrances" className="text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-primary transition-colors">
              Fragrances
            </Link>
            <Link to="/contact" className="text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile right: account + cart */}
          <div className="flex items-center gap-1 lg:hidden">
            <Link
              to={isAuthenticated ? "/account" : "/login"}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
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
          </div>

          {/* Desktop right: search + account + cart */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              to={isAuthenticated ? "/account" : "/login"}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
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
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-background lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link to="/streetwear" onClick={closeMobile} className="h-10 flex items-center">
              <img src={logoDoberman} alt="Mancini Milano" className="h-8 w-auto object-contain" />
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
            <Link to="/streetwear" onClick={closeMobile} className="block py-3 text-base uppercase tracking-button font-medium text-foreground min-h-[44px] flex items-center">
              Home
            </Link>
            <MobileAccordion label="For Him" slug="men" links={forHimLinks} onClose={closeMobile} />
            <MobileAccordion label="For Her" slug="women" links={forHerLinks} onClose={closeMobile} />
            <Link to="/streetwear/collections/fragrances" onClick={closeMobile} className="block py-3 text-base uppercase tracking-button font-medium text-foreground min-h-[44px] flex items-center">
              Fragrances
            </Link>
            <Link to="/contact" onClick={closeMobile} className="block py-3 text-base uppercase tracking-button font-medium text-foreground min-h-[44px] flex items-center">
              Contact
            </Link>

            <div className="border-t border-border mt-6 pt-6 space-y-1">
              <Link to="/about" onClick={closeMobile} className="block py-2.5 text-sm text-muted-foreground min-h-[44px] flex items-center">About Us</Link>
              <Link to="/faq" onClick={closeMobile} className="block py-2.5 text-sm text-muted-foreground min-h-[44px] flex items-center">FAQ</Link>
              <Link to="/size-guide" onClick={closeMobile} className="block py-2.5 text-sm text-muted-foreground min-h-[44px] flex items-center">Size Guide</Link>
              <Link to={isAuthenticated ? "/account" : "/login"} onClick={closeMobile} className="block py-2.5 text-sm text-muted-foreground min-h-[44px] flex items-center">
                {isAuthenticated ? "Mijn Account" : "Inloggen"}
              </Link>
            </div>
          </div>
        </div>
      )}

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
