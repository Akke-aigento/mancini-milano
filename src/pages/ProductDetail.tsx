import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, ChevronRight, Plus, Minus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import ProductCard, { formatPrice } from '@/components/ProductCard';
import { useSellQoCart } from '@/integrations/sellqo/CartContext';
import { useProduct, useRelatedProducts } from '@/integrations/sellqo/hooks';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useSellQoCart();
  const { data: product, isLoading: loading } = useProduct(slug || '');
  const { data: related = [] } = useRelatedProducts(slug || '');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');

  // Reset selections when slug changes
  const currentSlug = slug;
  const [prevSlug, setPrevSlug] = useState(slug);
  if (currentSlug !== prevSlug) {
    setPrevSlug(currentSlug);
    setSelectedSize(null);
    setSelectedColor(null);
    setSelectedImage(0);
    setAddedToCart(false);
  }

  const sizes = useMemo(() => {
    if (!product?.variants?.length) return [];
    const s = new Set<string>();
    product.variants.forEach((v: any) => {
      if (v.options?.size) s.add(v.options.size);
    });
    return Array.from(s);
  }, [product]);

  const colors = useMemo(() => {
    if (!product?.variants?.length) return [];
    const c = new Set<string>();
    product.variants.forEach((v: any) => {
      if (v.options?.color) c.add(v.options.color);
    });
    return Array.from(c);
  }, [product]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return null;
    return product.variants.find((v: any) => {
      const sizeMatch = !sizes.length || v.options?.size === selectedSize;
      const colorMatch = !colors.length || v.options?.color === selectedColor;
      return sizeMatch && colorMatch;
    }) || null;
  }, [product, selectedSize, selectedColor, sizes, colors]);

  const needsSize = sizes.length > 0;
  const needsColor = colors.length > 0;
  const canAddToCart = (!needsSize || selectedSize) && (!needsColor || selectedColor);
  const displayPrice = selectedVariant?.price ?? product?.price ?? 0;

  const handleAddToCart = async () => {
    if (!product || !canAddToCart) return;
    await addItem({
      product_id: product.id,
      variant_id: selectedVariant?.id,
      title: product.title,
      variant_title: selectedVariant?.title || '',
      price: displayPrice,
      quantity: 1,
      image: product.images?.[0]?.url,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-site mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="aspect-[3/4] bg-card animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 bg-card w-1/2 animate-pulse" />
              <div className="h-8 bg-card w-3/4 animate-pulse" />
              <div className="h-6 bg-card w-1/4 animate-pulse" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <section className="max-w-site mx-auto px-4 lg:px-8 py-20 text-center">
          <h1 className="font-heading text-3xl tracking-heading uppercase text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/" className="inline-block border border-foreground text-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors">
            Back to Home
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={product.title}
        description={product.description}
        image={product.images?.[0]?.url}
        type="product"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.title,
          description: product.description,
          image: product.images?.map((i: any) => i.url),
          offers: {
            '@type': 'Offer',
            price: displayPrice,
            priceCurrency: product.currency || 'EUR',
            availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
        }}
      />
      <div className="max-w-site mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          {product.category && (
            <>
              <Link to={`/collections/${product.category.slug}`} className="hover:text-foreground transition-colors">
                {product.category.name}
              </Link>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <span className="text-foreground truncate">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-12">
          <div>
            <div className="aspect-[3/4] overflow-hidden bg-card mb-3">
              {product.images?.[selectedImage] && (
                <img
                  src={product.images[selectedImage].url}
                  alt={product.images[selectedImage].alt || product.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-20 lg:w-20 lg:h-24 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-primary' : 'border-transparent hover:border-border'
                    }`}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {product.images.length > 1 && (
              <div className="flex lg:hidden justify-center gap-1.5 mt-3">
                {product.images.map((_: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      selectedImage === i ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-32 lg:self-start">
            <h1 className="font-heading text-2xl lg:text-[32px] tracking-heading uppercase text-foreground mb-3">
              {product.title}
            </h1>
            <p className="text-xl lg:text-2xl text-primary font-medium mb-5">
              {formatPrice(displayPrice)}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
              <Truck className="h-4 w-4" />
              <span>Free worldwide shipping</span>
            </div>

            {needsSize && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-button font-medium text-foreground">Size</span>
                  <Link to="/size-guide" className="text-xs uppercase tracking-button text-primary hover:text-gold-hover transition-colors">
                    Size Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                      className={`min-w-[48px] h-10 px-3 text-xs uppercase tracking-button font-medium border transition-colors ${
                        selectedSize === size
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {needsColor && (
              <div className="mb-6">
                <span className="text-xs uppercase tracking-button font-medium text-foreground mb-3 block">
                  Color{selectedColor ? `: ${selectedColor}` : ''}
                </span>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                      className={`px-4 py-2 text-xs uppercase tracking-button font-medium border transition-colors ${
                        selectedColor === color
                          ? 'border-primary text-primary'
                          : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={`w-full py-3.5 text-xs uppercase tracking-button font-medium transition-colors mb-6 ${
                addedToCart
                  ? 'bg-green-700 text-foreground'
                  : canAddToCart
                    ? 'border border-foreground text-foreground hover:bg-foreground hover:text-background'
                    : 'bg-card text-muted-foreground cursor-not-allowed'
              }`}
            >
              {addedToCart
                ? '✓ Added to Cart'
                : canAddToCart
                  ? 'Add to Cart'
                  : needsSize && !selectedSize
                    ? 'Select a Size'
                    : 'Select Options'}
            </button>

            <div className="border-t border-border">
              {[
                { key: 'description', label: 'Description', content: product.description },
                { key: 'shipping', label: 'Shipping & Returns', content: 'Free worldwide shipping on all orders. Returns accepted within 14 days of delivery. Items must be unworn, unwashed, and in original packaging with tags attached.' },
                { key: 'care', label: 'Care Instructions', content: 'Machine wash cold with similar colors. Do not bleach. Tumble dry low. Iron on low heat if needed. Do not dry clean.' },
              ].map(({ key, label, content }) => (
                <div key={key} className="border-b border-border">
                  <button
                    onClick={() => toggleAccordion(key)}
                    className="w-full flex items-center justify-between py-4 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    <span className="uppercase tracking-button text-xs">{label}</span>
                    {openAccordion === key ? (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  {openAccordion === key && (
                    <div className="pb-4 text-sm text-muted-foreground leading-relaxed">
                      {key === 'description' ? (
                        <div dangerouslySetInnerHTML={{ __html: content }} className="prose prose-sm prose-invert max-w-none" />
                      ) : (
                        content
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="max-w-site mx-auto px-4 lg:px-8 py-16 lg:py-24 border-t border-border mt-12">
          <h2 className="font-heading text-xl lg:text-2xl tracking-heading uppercase text-foreground mb-8 text-center">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 overflow-x-auto">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border p-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{product.title}</p>
            <p className="text-sm text-primary font-medium">{formatPrice(displayPrice)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className={`px-6 py-3 text-xs uppercase tracking-button font-medium transition-colors flex-shrink-0 min-h-[44px] ${
              addedToCart
                ? 'bg-green-700 text-foreground'
                : canAddToCart
                  ? 'bg-primary text-primary-foreground hover:bg-gold-hover'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {addedToCart ? '✓ Added' : canAddToCart ? 'Add to Cart' : 'Select Size'}
          </button>
        </div>
      </div>
      <div className="h-20 lg:hidden" />
    </Layout>
  );
};

export default ProductDetail;
