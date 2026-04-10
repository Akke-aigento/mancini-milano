import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (type: 'essential' | 'all') => {
    localStorage.setItem('cookie-consent', type);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="border-t border-border bg-card px-4 py-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
            Wij gebruiken cookies om je ervaring te verbeteren. Essentiële cookies zijn noodzakelijk voor het functioneren van de site. Met "Accepteren" sta je ook analytische cookies toe.{' '}
            <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-foreground transition-colors">
              Privacybeleid
            </Link>
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleConsent('essential')}
              className="text-xs border border-border text-muted-foreground hover:text-foreground hover:border-foreground px-4 py-2 transition-colors"
            >
              Alleen noodzakelijk
            </button>
            <button
              onClick={() => handleConsent('all')}
              className="text-xs border border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground px-4 py-2 transition-colors"
            >
              Accepteren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
