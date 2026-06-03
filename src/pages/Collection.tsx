import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { ChevronDown, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import ProductCard from '@/components/ProductCard';
import { useProducts, useCategories, sellqoKeys } from '@/integrations/sellqo/hooks';
import { productsAPI } from '@/integrations/sellqo/api';
import { extractArray } from '@/integrations/sellqo/client';
import { normalizeProducts } from '@/integrations/sellqo/normalizer';
import { useWorld } from '@/contexts/WorldContext';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

const MEN_SUBCATEGORIES = [
  { label: 'Jackets', slug: 'jackets' },
  { label: 'Hoodies', slug: 'hoodies' },
  { label: 'T-Shirts', slug: 't-shirts' },
  { label: 'Pants', slug: 'pants' },
  { label: 'Tracksuits', slug: 'tracksuits' },
  { label: 'Bags', slug: 'bags' },
  { label: 'Accessories', slug: 'accessories' },
];

const WOMEN_SUBCATEGORIES = [
  { label: 'Jackets', slug: 'jackets-women' },
  { label: 'Hoodies', slug: 'hoodies-women' },
  { label: 'T-Shirts', slug: 't-shirts-women' },
  { label: 'Pants', slug: 'pants-women' },
  { label: 'Tracksuits', slug: 'tracksuits-women' },
  { label: 'Bags', slug: 'bags-women' },
  { label: 'Accessories', slug: 'accessories-women' },
];

const PARENT_SLUGS = {
  streetwear: ['men', 'women'],
  classic: ['men-classic', 'classic-women', 'men', 'women'],
};

// In Classic world, map pretty URL slugs (men/women) to the real SellQo slugs.
const CLASSIC_SLUG_ALIASES: Record<string, string> = {
  men: 'men-classic',
  women: 'classic-women',
};

const isClassicCat = (s?: string) =>
  !!s && (
    s === 'classic' ||
    s.startsWith('men-classic') ||
    s.startsWith('classic-women') ||
    s.startsWith('outerware-men-classic') ||
    s.startsWith('outerware-women-classic')
  );

function collectDescendantSlugs(categories: any[], rootSlug: string): string[] {
  const root = categories.find((c) => c.slug === rootSlug);
  if (!root) return [rootSlug];
  const result: string[] = [rootSlug];
  const queue: string[] = [root.id];
  while (queue.length) {
    const parentId = queue.shift()!;
    for (const c of categories) {
      if (c.parent_id === parentId) {
        result.push(c.slug);
        queue.push(c.id);
      }
    }
  }
  return result;
}

const Collection = () => {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const { currentWorld } = useWorld();
  const world = currentWorld === 'classic' ? 'classic' : 'streetwear';
  const basePath = world === 'classic' ? '/classic' : '/streetwear';

  // Resolve route slug to the actual SellQo category slug for Classic aliases.
  const slug = world === 'classic' && routeSlug
    ? (CLASSIC_SLUG_ALIASES[routeSlug] ?? routeSlug)
    : routeSlug;

  const parentCategories = PARENT_SLUGS[world];
  // Classic uses a flat collection layout (pills + product grid) on parent pages too.
  const isParent = world === 'streetwear' && slug ? parentCategories.includes(slug) : false;

  const { data: categories = [] } = useCategories();
  const [sort, setSort] = useState<SortOption>('featured');

  // For Classic: fetch products from all descendant categories (API doesn't include children).
  // For Streetwear: single category fetch (unchanged behavior).
  const descendantSlugs = useMemo(() => {
    if (world !== 'classic' || !slug) return [];
    if (categories.length === 0) return [];
    return collectDescendantSlugs(categories, slug);
  }, [world, slug, categories]);

  // Streetwear single query
  const streetwearQuery = useProducts(
    world === 'streetwear' && slug ? { category_slug: slug } : undefined
  );

  // Classic descendant queries
  const classicQueries = useQueries({
    queries: descendantSlugs.map((s) => ({
      queryKey: sellqoKeys.products.list({ category_slug: s }),
      queryFn: async () => {
        const res = await productsAPI.getAll({ category_slug: s });
        return normalizeProducts(extractArray<any>(res));
      },
      enabled: world === 'classic' && !!s,
    })),
  });

  const products = useMemo(() => {
    if (world === 'streetwear') return streetwearQuery.data ?? [];
    const seen = new Set<string>();
    const out: any[] = [];
    for (const q of classicQueries) {
      for (const p of (q.data ?? [])) {
        if (!seen.has(p.id)) {
          seen.add(p.id);
          out.push(p);
        }
      }
    }
    return out;
  }, [world, streetwearQuery.data, classicQueries]);

  const loading = world === 'streetwear'
    ? streetwearQuery.isLoading
    : (descendantSlugs.length === 0 || classicQueries.some((q) => q.isLoading));

  const filteredByWorld = useMemo(
    () => products.filter((p: any) =>
      world === 'classic' ? isClassicCat(p.category?.slug) : !isClassicCat(p.category?.slug)
    ),
    [products, world]
  );

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredByWorld];
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
  }, [filteredByWorld, sort]);

  const collection = categories.find((c: any) => c.slug === slug);
  const baseTitle = collection?.name || slug?.replace(/-/g, ' ') || '';
  // Strip gender/world suffix from title display
  const title = baseTitle
    .replace(/\s*-?\s*women$/i, '')
    .replace(/\s*\(women\)$/i, '')
    .replace(/\s*-?\s*classic$/i, '')
    .replace(/^classic\s+/i, '');

  const subcategoryCards = useMemo(() => {
    if (world === 'classic') {
      // Dynamic: derive subcategories from SellQo categories under the parent
      const parent = categories.find((c: any) => c.slug === slug);
      if (!parent) return [];
      const children = categories.filter((c: any) => c.parent_id === parent.id);
      return children.map((c: any) => ({
        label: c.name.replace(/\s*-?\s*classic$/i, '').replace(/^classic\s+/i, ''),
        slug: c.slug,
        image: c.image || '',
      }));
    }
    const subs = slug === 'women' ? WOMEN_SUBCATEGORIES : MEN_SUBCATEGORIES;
    return subs.map((sub) => {
      const apiCat = categories.find((c: any) => c.slug === sub.slug);
      return {
        label: sub.label,
        slug: sub.slug,
        image: apiCat?.image || '',
      };
    });
  }, [categories, slug, world]);


  // For non-parent pages, build subcategory pills
  const pills = !isParent && slug
    ? (() => {
        const col = categories.find((c: any) => c.slug === slug);
        if (!col) return undefined;
        const children = categories.filter((c: any) => c.parent_id && c.parent_id === col.id);
        if (children.length === 0) return undefined;
        return [
          { label: 'All', slug: slug },
          ...children.map((c: any) => ({ label: c.name, slug: c.slug })),
        ];
      })()
    : undefined;

  // Parent category page: show category grid
  if (isParent) {
    return (
      <Layout>
        <SEO title={title} description={`Shop ${title} at Mancini Milano. ${world === 'classic' ? 'Refined Italian classics.' : 'Premium Italian luxury streetwear.'}`} />
        <section className="max-w-site mx-auto px-4 lg:px-8 pt-12 pb-6 lg:pt-16 lg:pb-8">
          <h1 className="font-heading text-3xl lg:text-4xl tracking-heading uppercase text-foreground mb-2 text-center">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Browse our categories
          </p>
        </section>

        <section className="max-w-site mx-auto px-4 lg:px-8 pb-20 lg:pb-28">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {subcategoryCards.map((cat) => (
              <Link
                key={cat.slug}
                to={`${basePath}/collections/${cat.slug}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-3">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.label}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm uppercase tracking-widest">{cat.label}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">{cat.label}</h3>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Layout>
    );
  }

  // Regular collection page with products
  return (
    <Layout>
      <SEO title={title} description={`Shop ${title} at Mancini Milano. ${world === 'classic' ? 'Refined Italian classics.' : 'Premium Italian luxury streetwear.'}`} />
      <section className="max-w-site mx-auto px-4 lg:px-8 pt-12 pb-6 lg:pt-16 lg:pb-8">
        <h1 className="font-heading text-3xl lg:text-4xl tracking-heading uppercase text-foreground mb-2 text-center">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
        </p>
      </section>

      <section className="max-w-site mx-auto px-4 lg:px-8 pb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
          {pills && pills.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              {pills.map((pill) => (
                <Link
                  key={pill.slug}
                  to={`${basePath}/collections/${pill.slug}`}
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
            <p className="text-lg text-muted-foreground mb-2">Coming Soon</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We're working on this collection. Stay tuned.
            </p>
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
