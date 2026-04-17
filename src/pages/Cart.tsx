import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/SEO';
import { useSellQoCart } from '@/integrations/sellqo/CartContext';
import { formatPrice } from '@/components/ProductCard';

const Cart = () => {
  const navigate = useNavigate();
  const { items, subtotal, total, updateQuantity, removeItem, isLoading, cart } = useSellQoCart();
  const discountAmount = cart?.discount || 0;

  return (
    <Layout>
      <section className="max-w-site mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="font-heading text-3xl lg:text-4xl tracking-heading uppercase text-foreground mb-10 text-center">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="font-heading text-xl tracking-heading uppercase text-foreground mb-3">Your cart is empty</h2>
            <p className="text-sm text-muted-foreground mb-8">Discover our collections and find something you love.</p>
            <Link
              to="/collections/for-him"
              className="inline-block border border-foreground text-foreground px-8 py-3 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16">
            <div>
              <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 pb-4 border-b border-border text-xs uppercase tracking-button text-muted-foreground font-medium">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span className="text-right">Total</span>
              </div>

              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.id} className="py-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center">
                    <div className="flex gap-4">
                      <div className="w-20 h-[100px] flex-shrink-0 overflow-hidden">
                        {item.image && (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-foreground truncate">{item.title}</h3>
                        {item.variant_title && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.variant_title}</p>
                        )}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors mt-2 lg:hidden"
                        >
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-primary font-medium">{formatPrice(item.price)}</div>
                    <div className="flex items-center gap-0">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-sm font-medium text-foreground min-w-[32px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-3 text-muted-foreground hover:text-destructive transition-colors hidden lg:block"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-sm font-medium text-foreground text-right">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-32 lg:self-start">
              <div className="bg-card border border-border p-6">
                <h2 className="text-sm uppercase tracking-button font-medium text-foreground mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount{cart?.discount_code ? ` (${cart.discount_code})` : ''}</span>
                      <span className="text-primary">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-primary">Free</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="text-sm font-medium text-foreground">Total</span>
                    <span className="text-lg font-medium text-foreground">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  disabled={isLoading}
                  className="w-full border border-foreground text-foreground py-3.5 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 mb-3"
                >
                  Checkout
                </button>

                <Link
                  to="/"
                  className="block text-center text-xs uppercase tracking-button text-muted-foreground hover:text-foreground transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Cart;
