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
        className="flex items-center gap-1 text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-foreground transition-colors"
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

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();

  return (
    <nav className="sticky top-9 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-site mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="font-heading text-lg tracking-logo uppercase text-foreground">
          Mancini Milano
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <Link to="/" className="text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <DropdownMenu label="For Him" links={forHimLinks} slug="for-him" />
          <DropdownMenu label="For Her" links={forHerLinks} slug="for-her" />
          <Link to="/collections/fragrances" className="text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-foreground transition-colors">
            Fragrances
          </Link>
          <Link to="/contact" className="text-xs uppercase tracking-button font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            <User className="h-5 w-5" />
          </button>
          <button onClick={openDrawer} className="relative text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="px-4 py-6 space-y-4">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block text-sm uppercase tracking-button font-medium text-foreground">Home</Link>
            <Link to="/collections/for-him" onClick={() => setMobileOpen(false)} className="block text-sm uppercase tracking-button font-medium text-foreground">For Him</Link>
            <div className="pl-4 space-y-2">
              {forHimLinks.map(l => (
                <Link key={l.slug} to={`/collections/${l.slug}`} onClick={() => setMobileOpen(false)} className="block text-xs uppercase tracking-button text-muted-foreground">{l.label}</Link>
              ))}
            </div>
            <Link to="/collections/for-her" onClick={() => setMobileOpen(false)} className="block text-sm uppercase tracking-button font-medium text-foreground">For Her</Link>
            <div className="pl-4 space-y-2">
              {forHerLinks.map(l => (
                <Link key={l.slug} to={`/collections/${l.slug}`} onClick={() => setMobileOpen(false)} className="block text-xs uppercase tracking-button text-muted-foreground">{l.label}</Link>
              ))}
            </div>
            <Link to="/collections/fragrances" onClick={() => setMobileOpen(false)} className="block text-sm uppercase tracking-button font-medium text-foreground">Fragrances</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="block text-sm uppercase tracking-button font-medium text-foreground">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
