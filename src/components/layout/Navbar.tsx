import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import SearchOverlay from '@/components/SearchOverlay';

const forHimLinks = [
  { label: 'T-Shirts', slug: 't-shirts' },
  { label: 'Jackets', slug: 'jackets' },
  { label: 'Pants', slug: 'pants' },
  { label: 'Hoodies', slug: 'hoodies' },
  { label: 'Accessories', slug: 'accessories' },
];

const forHerLinks = [
  { label: 'T-Shirts', slug: 't-shirts' },
  { label: 'Jackets', slug: 'jackets' },
  { label: 'Pants', slug: 'pants' },
  { label: 'Hoodies', slug: 'hoodies' },
];

function DropdownMenu({ label, links, slug }: { label: string; links: { label: string; slug: string }[]; slug: string }) {
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
        <ChevronDown className="h-3 w-3" />
      </Link>
      {open && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-card border border-border min-w-[180px] py-2">
            {links.map(link => (
              <Link
                key={link.slug}
                to={`/collections/${link.slug}`}
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
              to={`/collections/${l.slug}`}
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
  const { itemCount, openDrawer } = useCart();

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav className="sticky top-9 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-site mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
          {/* Logo */}
          <Link to="/" className="font-heading text-lg tracking-logo uppercase text-foreground">
            Mancini Milano
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <DropdownMenu label="For Him" links={forHimLinks} slug="for-him" />
            <DropdownMenu label="For Her" links={forHerLinks} slug="for-her" />
            <Link to="/collections/fragrances" className="text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-primary transition-colors">
              Fragrances
            </Link>
            <Link to="/contact" className="text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              className="min-w-[44px] min-h-[44px] items-center justify-center text-muted-foreground hover:text-foreground transition-colors hidden sm:flex"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </button>
            <button
              onClick={openDrawer}
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

      {/* Full-screen mobile menu */}
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
            <MobileAccordion label="For Him" slug="for-him" links={forHimLinks} onClose={closeMobile} />
            <MobileAccordion label="For Her" slug="for-her" links={forHerLinks} onClose={closeMobile} />
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
