import { useMemo, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import ProductCard from '@/components/ProductCard';
import { useProducts, useCategories } from '@/integrations/sellqo/hooks';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

const Collection = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const genderFilter = searchParams.get('gender'); // 'men' or 'women'
  
  // Primary fetch: gender category when filter active, otherwise the slug
  const primarySlug = genderFilter || slug;
  const { data: primaryProducts = [], isLoading: primaryLoading } = useProducts(primarySlug ? { category_slug: primarySlug } : undefined);
  
  // Secondary fetch: subcategory slug, only when gender filter is active
  const { data: subcategoryProducts = [], isLoading: subcategoryLoading } = useProducts(
    genderFilter && slug ? { category_slug: slug } : undefined
  );
  
  const { data: categories = [] } = useCategories();
  const [sort, setSort] = useState<SortOption>('featured');
  const loading = primaryLoading || (genderFilter ? subcategoryLoading : false);

  // Intersect gender + subcategory products when both are fetched
  const genderFilteredProducts = useMemo(() => {
    if (!genderFilter || !slug) return primaryProducts;
    // Intersect: products that appear in both the gender set and the subcategory set
    const genderIds = new Set(primaryProducts.map(p => p.id));
    return subcategoryProducts.filter(p => genderIds.has(p.id));
  }, [primaryProducts, subcategoryProducts, genderFilter, slug]);

  const sortedProducts = useMemo(() => {
    const sorted = [...genderFilteredProducts];
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
  }, [genderFilteredProducts, sort]);

  const collection = categories.find((c: any) => c.slug === slug);
  const baseTitle = collection?.name || slug?.replace(/-/g, ' ') || '';
  const title = baseTitle;

  // Build subcategory pills from API categories
  const parentCategories = ['men', 'women'];
  const isParent = slug && parentCategories.includes(slug);
  const pills = isParent
    ? [
        { label: 'All', slug: slug! },
        ...categories
          .filter((c: any) => c.parent_id && c.parent_id === collection?.id)
          .map((c: any) => ({ label: c.name, slug: c.slug })),
      ]
    : undefined;

  return (
    <Layout>
      <SEO title={title} description={`Shop ${title} at Mancini Milano. Premium Italian luxury streetwear.`} />
      <section className="max-w-site mx-auto px-4 lg:px-8 pt-12 pb-6 lg:pt-16 lg:pb-8">
        <h1 className="font-heading text-3xl lg:text-4xl tracking-heading uppercase text-foreground mb-2 text-center">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          {genderFilteredProducts.length} {genderFilteredProducts.length === 1 ? 'product' : 'products'}
        </p>
      </section>

      <section className="max-w-site mx-auto px-4 lg:px-8 pb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
          {pills && pills.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              {pills.map((pill) => (
                <Link
                  key={pill.slug}
                  to={`/collections/${pill.slug}${genderFilter ? `?gender=${genderFilter}` : ''}`}
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
          ) : (
            <div />
          )}

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
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Collection;
