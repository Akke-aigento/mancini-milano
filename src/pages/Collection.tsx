import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import ProductCard from '@/components/ProductCard';
import {
  getCollectionProducts,
  getCollections,
  extractProducts,
  extractCollections,
} from '@/lib/sellqo';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

const subcategoryPills: Record<string, { label: string; slug: string }[]> = {
  'for-him': [
    { label: 'All', slug: 'for-him' },
    { label: 'T-Shirts', slug: 't-shirts' },
    { label: 'Jackets', slug: 'jackets' },
    { label: 'Pants', slug: 'pants' },
    { label: 'Accessories', slug: 'accessories' },
  ],
  'for-her': [
    { label: 'All', slug: 'for-her' },
    { label: 'T-Shirts', slug: 't-shirts' },
    { label: 'Jackets', slug: 'jackets' },
    { label: 'Pants', slug: 'pants' },
  ],
};

const Collection = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [collection, setCollection] = useState<any>(null);
  const [sort, setSort] = useState<SortOption>('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    getCollectionProducts(slug).then((res) => {
      const { products: mapped, total: t } = extractProducts(res);
      setProducts(mapped);
      setTotal(t);
      setLoading(false);
    });

    getCollections().then((res) => {
      const cols = extractCollections(res);
      const found = cols.find((c: any) => c.slug === slug);
      setCollection(found || null);
    });
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sort) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.reverse();
      default:
        return sorted;
    }
  }, [products, sort]);

  const title = collection?.name || slug?.replace(/-/g, ' ') || '';
  const pills = slug ? subcategoryPills[slug] : undefined;

  return (
    <Layout>
      {/* Header */}
      <section className="max-w-site mx-auto px-4 lg:px-8 pt-12 pb-6 lg:pt-16 lg:pb-8">
        <h1 className="font-heading text-3xl lg:text-4xl tracking-heading uppercase text-foreground mb-2 text-center">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          {total} {total === 1 ? 'product' : 'products'}
        </p>
      </section>

      {/* Filter bar */}
      <section className="max-w-site mx-auto px-4 lg:px-8 pb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
          {/* Subcategory pills */}
          {pills && (
            <div className="flex flex-wrap gap-2">
              {pills.map((pill) => (
                <Link
                  key={pill.slug}
                  to={`/collections/${pill.slug}`}
                  className={`px-4 py-1.5 text-xs uppercase tracking-button font-medium border transition-colors ${
                    slug === pill.slug
                      ? 'border-primary text-primary'
                      : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                  }`}
                >
                  {pill.label}
                </Link>
              ))}
            </div>
          )}
          {!pills && <div />}

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="appearance-none bg-card border border-border text-sm text-foreground pl-3 pr-8 py-2 focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="newest">Newest</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="max-w-site mx-auto px-4 lg:px-8 pb-20 lg:pb-28">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-card mb-3" />
                <div className="h-4 bg-card w-3/4 mb-2" />
                <div className="h-4 bg-card w-1/4" />
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No products found in this collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {sortedProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Collection;
