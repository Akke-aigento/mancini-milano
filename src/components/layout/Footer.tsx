import { Link } from 'react-router-dom';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-site mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-lg tracking-logo uppercase text-foreground mb-4">Mancini Milano</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Italian luxury streetwear. Elevated essentials for those who move with authority.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs uppercase tracking-button font-medium text-foreground mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'For Him', to: '/collections/for-him' },
                { label: 'For Her', to: '/collections/for-her' },
                { label: 'T-Shirts', to: '/collections/t-shirts' },
                { label: 'Jackets', to: '/collections/jackets' },
                { label: 'Accessories', to: '/collections/accessories' },
                { label: 'Fragrances', to: '/collections/fragrances' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs uppercase tracking-button font-medium text-foreground mb-4">Information</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
                { label: 'FAQ', to: '/faq' },
                { label: 'Size Guide', to: '/size-guide' },
                { label: 'Privacy Policy', to: '/privacy-policy' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + Newsletter */}
          <div>
            <h4 className="text-xs uppercase tracking-button font-medium text-foreground mb-4">Stay Connected</h4>
            <div className="flex gap-3 mb-6">
              <a href="https://instagram.com/mancinimilano" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Subscribe to our newsletter</p>
            <form onSubmit={(e) => { e.preventDefault(); setEmail(''); }} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 text-xs uppercase tracking-button font-medium hover:bg-gold-hover transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-site mx-auto px-4 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Mancini Milano. All Rights Reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Visa</span>
            <span>•</span>
            <span>Mastercard</span>
            <span>•</span>
            <span>PayPal</span>
            <span>•</span>
            <span>Bancontact</span>
            <span>•</span>
            <span>iDEAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
