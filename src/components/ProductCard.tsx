import { Link } from 'react-router-dom';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price);
}

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    title: string;
    price: number;
    images: { url: string; alt?: string }[];
    in_stock?: boolean;
    stock_status?: string;
  };
  preferredImageIndex?: number;
}

const ProductCard = ({ product, preferredImageIndex }: ProductCardProps) => {
  const primaryIndex = preferredImageIndex ?? 0;
  const secondaryIndex = primaryIndex === 0 ? 1 : 0;
  const hasSecondImage = product.images.length > 1;
  const allowHoverImage = hasSecondImage && product.slug !== 'the-boss-fragrance-tee' && preferredImageIndex == null;
  const isOutOfStock = product.in_stock === false || product.stock_status === 'out_of_stock';

  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden mb-3 bg-card">
        {product.images?.[primaryIndex] && (
          <img
            src={product.images[primaryIndex].url}
            alt={product.images[primaryIndex].alt || product.title}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-contain transition-all duration-700 ${
              allowHoverImage
                ? 'group-hover:opacity-0'
                : 'group-hover:scale-105'
            }`}
          />
        )}
        {allowHoverImage && (
          <img
            src={product.images[secondaryIndex].url}
            alt={product.images[secondaryIndex].alt || product.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          />
        )}
        {isOutOfStock && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-foreground text-background text-[10px] uppercase tracking-button font-medium px-2.5 py-1">
              Sold Out
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors flex items-center justify-center">
          <span className="text-xs uppercase tracking-button font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 px-4 py-2">
            Quick View
          </span>
        </div>
      </div>
      <h3 className="text-sm font-medium text-foreground mb-1 truncate">{product.title}</h3>
      <p className="text-sm text-primary font-medium">{formatPrice(product.price)}</p>
    </Link>
  );
};

export default ProductCard;
export { formatPrice };
