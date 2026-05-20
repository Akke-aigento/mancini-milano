import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useSellQoCart } from '@/integrations/sellqo/CartContext';
import { useCustomerAuth } from '@/integrations/sellqo/CustomerAuthContext';
import { useCategories } from '@/integrations/sellqo/hooks';
import { useWorld, World } from '@/contexts/WorldContext';
import SearchOverlay from '@/components/SearchOverlay';
import WorldSwitch from '@/components/WorldSwitch';
import logoDoberman from '@/assets/logo-doberman.png';

type ShowIn = 'both' | 'streetwear' | 'classic';
interface NavItem {
  label: string;
  basePath: string;
  showIn: ShowIn;
  useWorldPrefix: boolean;
  subLinks?: { label: string; slug: string }[];
}

const FOR_HIM_LINKS = [
  { label: 'Jackets', slug: 'jackets' },
  { label: 'Hoodies', slug: 'hoodies' },
  { label: 'T-Shirts', slug: 't-shirts' },
  { label: 'Pants', slug: 'pants' },
  { label: 'Tracksuits', slug: 'tracksuits' },
  { label: 'Bags', slug: 'bags' },
  { label: 'Accessories', slug: 'accessories' },
];

const FOR_HER_LINKS = [
  { label: 'Jackets', slug: 'jackets-women' },
  { label: 'Hoodies', slug: 'hoodies-women' },
  { label: 'T-Shirts', slug: 't-shirts-women' },
  { label: 'Pants', slug: 'pants-women' },
  { label: 'Tracksuits', slug: 'tracksuits-women' },
  { label: 'Bags', slug: 'bags-women' },
  { label: 'Accessories', slug: 'accessories-women' },
];

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', basePath: '', showIn: 'both', useWorldPrefix: true },
  { label: 'For Him', basePath: '/collections/men', showIn: 'both', useWorldPrefix: true, subLinks: FOR_HIM_LINKS },
  { label: 'For Her', basePath: '/collections/women', showIn: 'both', useWorldPrefix: true, subLinks: FOR_HER_LINKS },
  { label: 'Fragrances', basePath: '/collections/fragrances', showIn: 'streetwear', useWorldPrefix: true },
  { label: 'Contact', basePath: '/contact', showIn: 'both', useWorldPrefix: false },
];

function resolveHref(item: NavItem, world: World): string {
  if (!item.useWorldPrefix) return item.basePath || '/';
  const base = `/${world}${item.basePath}`;
  return base;
}

function DropdownMenu({ label, href, links, scrolled, isHome, openUp }: { label: string; href: string; links: { label: string; href: string }[]; scrolled: boolean; isHome: boolean; openUp: boolean }) {
  const [open, setOpen] = useState(false);
  const upward = openUp && isHome && !scrolled;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to={href}
        className="flex items-center gap-1 text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        {label}
        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${upward ? 'rotate-180' : ''}`} />
      </Link>
      {open && (
        <div className={`absolute left-0 z-50 ${upward ? 'bottom-full pb-2' : 'top-full pt-2'}`}>
          <div className="bg-card border border-border min-w-[180px] py-2">
            {links.map(link => (
              <Link
                key={link.href}
                to={link.href}
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

function MobileAccordion({ label, href, links, onClose }: { label: string; href: string; links: { label: string; href: string }[]; onClose: () => void }) {
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
              key={l.href}
              to={l.href}
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

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useCustomerAuth();
  const { itemCount, openCart } = useSellQoCart();
  useCategories();
  const location = useLocation();
  const { homeHref, currentWorld, lastActiveWorld } = useWorld();
  const isHome = location.pathname === '/streetwear' || location.pathname === '/classic';
  const isClassic = currentWorld === 'classic';
  const effectiveWorld: World = currentWorld ?? lastActiveWorld ?? 'streetwear';

  const visibleItems = NAV_ITEMS.filter(item => item.showIn === 'both' || item.showIn === effectiveWorld);

  const BrandMark = ({ className = 'h-9 w-auto' }: { className?: string }) =>
    isClassic ? (
      <span
        className="font-classic text-foreground uppercase leading-none whitespace-nowrap text-[15px] sm:text-base"
        style={{ letterSpacing: '0.28em' }}
      >
        Mancini Milano
      </span>
    ) : (
      <img src={logoDoberman} alt="Mancini Milano" className={`${className} object-contain`} />
    );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const renderDesktopItem = (item: NavItem) => {
    const href = resolveHref(item, effectiveWorld);
    if (item.label === 'Home') {
      return (
        <Link key={item.label} to={homeHref} className="text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-primary transition-colors">
          {item.label}
        </Link>
      );
    }
    if (item.subLinks) {
      const subLinks = item.subLinks.map(s => ({ label: s.label, href: `/${effectiveWorld}/collections/${s.slug}` }));
      return <DropdownMenu key={item.label} label={item.label} href={href} links={subLinks} scrolled={scrolled} isHome={isHome} openUp={effectiveWorld === 'streetwear'} />;
    }
    return (
      <Link key={item.label} to={href} className="text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-primary transition-colors">
        {item.label}
      </Link>
    );
  };

  const renderMobileItem = (item: NavItem) => {
    const href = resolveHref(item, effectiveWorld);
    if (item.label === 'Home') {
      return (
        <Link key={item.label} to={homeHref} onClick={closeMobile} className="block py-3 text-base uppercase tracking-button font-medium text-foreground min-h-[44px] flex items-center">
          {item.label}
        </Link>
      );
    }
    if (item.subLinks) {
      const subLinks = item.subLinks.map(s => ({ label: s.label, href: `/${effectiveWorld}/collections/${s.slug}` }));
      return <MobileAccordion key={item.label} label={item.label} href={href} links={subLinks} onClose={closeMobile} />;
    }
    return (
      <Link key={item.label} to={href} onClick={closeMobile} className="block py-3 text-base uppercase tracking-button font-medium text-foreground min-h-[44px] flex items-center">
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-site mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
          {/* Mobile left: hamburger only */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Logo — centered on mobile, left on desktop */}
          <Link to={homeHref} className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-auto lg:translate-x-0 h-10 flex items-center">
            <BrandMark />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {visibleItems.map(renderDesktopItem)}
          </div>

          {/* Mobile right: world switch + cart */}
          <div className="flex items-center gap-0.5 lg:hidden">
            <WorldSwitch variant="mobile" />
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
            <WorldSwitch variant="desktop" className="mr-2" />
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
            <Link to={homeHref} onClick={closeMobile} className="h-10 flex items-center">
              <BrandMark className="h-8 w-auto" />
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
            {/* Quick actions: search + account */}
            <div className="grid grid-cols-2 gap-2 pb-4 border-b border-border">
              <button
                onClick={() => { setSearchOpen(true); closeMobile(); }}
                className="flex items-center justify-center gap-2 h-12 border border-border text-xs uppercase tracking-button text-foreground hover:border-classic-gold/60 hover:text-classic-gold transition-colors"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
              <Link
                to={isAuthenticated ? "/account" : "/login"}
                onClick={closeMobile}
                className="flex items-center justify-center gap-2 h-12 border border-border text-xs uppercase tracking-button text-foreground hover:border-classic-gold/60 hover:text-classic-gold transition-colors"
                aria-label="Account"
              >
                <User className="h-4 w-4" />
                <span>{isAuthenticated ? "Account" : "Sign In"}</span>
              </Link>
            </div>

            <div className="pt-2">
              {visibleItems.map(renderMobileItem)}
            </div>

            <div className="border-t border-border mt-6 pt-6 space-y-1">
              <Link to="/about" onClick={closeMobile} className="block py-2.5 text-sm text-muted-foreground min-h-[44px] flex items-center">About Us</Link>
              <Link to="/faq" onClick={closeMobile} className="block py-2.5 text-sm text-muted-foreground min-h-[44px] flex items-center">FAQ</Link>
              <Link to="/size-guide" onClick={closeMobile} className="block py-2.5 text-sm text-muted-foreground min-h-[44px] flex items-center">Size Guide</Link>
            </div>

            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Shop</p>
              <WorldSwitch variant="full" onSwitch={closeMobile} />
            </div>
          </div>
        </div>
      )}

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
