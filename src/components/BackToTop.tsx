import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';

const BackToTop = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  const isProductPage = pathname.startsWith('/products/');

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible || isProductPage) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary flex items-center justify-center transition-all"
      aria-label="Back to top"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
};

export default BackToTop;
