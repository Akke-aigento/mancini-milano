import { Link } from 'react-router-dom';
import { useState } from 'react';
import { newsletterAPI } from '@/integrations/sellqo/api';
import { toast } from 'sonner';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
                { label: 'For Him', to: '/collections/men' },
                { label: 'For Her', to: '/collections/women' },
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
              <a href="https://www.instagram.com/mancinimilanostore/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Subscribe to our newsletter</p>
            {submitted ? (
              <p className="text-sm text-foreground">Welcome to the movement. You're in. ✓</p>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!email || loading) return;
                setLoading(true);
                try {
                  await newsletterAPI.subscribe(email);
                  setSubmitted(true);
                } catch {
                  toast.error('Something went wrong. Please try again.');
                } finally {
                  setLoading(false);
                }
              }} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full border border-foreground text-foreground bg-transparent px-4 py-2 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
                >
                  {loading ? '...' : 'Subscribe'}
                </button>
              </form>
            )}
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
