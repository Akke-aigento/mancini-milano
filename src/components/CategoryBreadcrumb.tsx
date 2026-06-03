import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useCategories } from '@/integrations/sellqo/hooks';
import { useWorld, World } from '@/contexts/WorldContext';
import type { Category } from '@/integrations/sellqo/types';

interface CategoryBreadcrumbProps {
  categorySlug?: string;
  productTitle?: string;
}

const WORLD_ROOTS: Record<World, { slug: string; label: string }[]> = {
  streetwear: [
    { slug: 'men', label: 'Men' },
    { slug: 'women', label: 'Women' },
  ],
  classic: [
    { slug: 'men-classic', label: 'Men' },
    { slug: 'classic-women', label: 'Women' },
  ],
};

function cleanLabel(name: string) {
  return name
    .replace(/\s*-?\s*women$/i, '')
    .replace(/\s*\(women\)$/i, '')
    .replace(/\s*-?\s*classic$/i, '')
    .replace(/^classic\s+/i, '')
    .trim();
}

const CategoryBreadcrumb = ({ categorySlug, productTitle }: CategoryBreadcrumbProps) => {
  const { currentWorld } = useWorld();
  const world: World = currentWorld === 'classic' ? 'classic' : 'streetwear';
  const basePath = `/${world}`;
  const { data: categories = [] } = useCategories();

  const roots = WORLD_ROOTS[world];
  const rootSlugs = new Set(roots.map((r) => r.slug));
  const rootLabelBySlug = new Map(roots.map((r) => [r.slug, r.label] as const));

  // Walk parent_id chain from the current category up to (and including) the world root.
  const chain: { slug: string; label: string }[] = [];
  if (categorySlug && categories.length) {
    const byId = new Map<string, Category>(categories.map((c) => [c.id, c]));
    let current: Category | undefined = categories.find((c) => c.slug === categorySlug);
    const guard = new Set<string>();
    while (current && !guard.has(current.id)) {
      guard.add(current.id);
      const label = rootLabelBySlug.get(current.slug) ?? cleanLabel(current.name);
      chain.unshift({ slug: current.slug, label });
      if (rootSlugs.has(current.slug)) break;
      current = current.parent_id ? byId.get(current.parent_id) : undefined;
    }
    // Fallback: category not found in tree
    if (chain.length === 0) {
      chain.push({ slug: categorySlug, label: cleanLabel(categorySlug.replace(/-/g, ' ')) });
    }
  }

  // Determine which items are clickable. If productTitle is set, every category in the chain is a link.
  // Otherwise the last category (current page) is plain text.
  const lastClickableIndex = productTitle ? chain.length - 1 : chain.length - 2;

  return (
    <nav
      aria-label="Breadcrumb"
      className="overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ol className="flex items-center gap-2 font-body text-xs text-muted-foreground">
        <li>
          <Link to={basePath} className="hover:text-foreground transition-colors">
            Home
          </Link>
        </li>
        {chain.map((item, idx) => {
          const clickable = idx <= lastClickableIndex;
          return (
            <li key={item.slug} className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />
              {clickable ? (
                <Link
                  to={`${basePath}/collections/${item.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
            </li>
          );
        })}
        {productTitle && (
          <li className="flex items-center gap-2">
            <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="text-foreground">{productTitle}</span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default CategoryBreadcrumb;
