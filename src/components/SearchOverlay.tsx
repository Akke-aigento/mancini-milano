import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { productsAPI } from '@/integrations/sellqo/api';
import { extractArray } from '@/integrations/sellqo/client';
import { normalizeProducts } from '@/integrations/sellqo/normalizer';
import { formatPrice } from '@/components/ProductCard';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await productsAPI.search(value.trim());
        const raw = extractArray<any>(res);
        const products = normalizeProducts(raw);
        setResults(products.slice(0, 6));
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col">
      <div className="flex items-center justify-end p-4 lg:p-6">
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 lg:px-8 mt-8 lg:mt-16">
        <div className="border-b-2 border-primary pb-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent text-foreground font-heading text-2xl lg:text-[28px] tracking-heading placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 lg:px-8 mt-8 flex-1 overflow-y-auto">
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-16 h-20 bg-card" />
                <div className="flex-1 space-y-2 py-2">
                  <div className="h-4 bg-card w-3/4" />
                  <div className="h-3 bg-card w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <p className="text-muted-foreground text-sm">No products found for "{query}"</p>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-2">
            {results.map((product: any) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 p-3 hover:bg-card transition-colors group"
              >
                <div className="w-14 h-[70px] flex-shrink-0 bg-card overflow-hidden">
                  {product.images?.[0] && (
                    <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {product.title}
                  </h3>
                  {product.category && (
                    <p className="text-xs text-muted-foreground mt-0.5">{product.category.name}</p>
                  )}
                </div>
                <span className="text-sm text-primary font-medium flex-shrink-0">
                  {formatPrice(product.price)}
                </span>
              </Link>
            ))}
          </div>
        )}

        {!query && (
          <p className="text-muted-foreground text-sm">Start typing to search products...</p>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
