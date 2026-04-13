import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useSellQoCart } from '@/integrations/sellqo/CartContext';
import { formatPrice } from '@/components/ProductCard';

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    items, itemCount, subtotal, total,
    isOpen, closeCart,
    updateQuantity, removeItem, isLoading,
    cart,
  } = useSellQoCart();


  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const discountAmount = cart?.discount || 0;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
        onClick={closeCart}
      />
      <div className="fixed top-0 right-0 z-50 h-full w-full sm:max-w-md bg-card border-l border-border flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-sm uppercase tracking-button font-medium text-foreground">
            Cart ({itemCount})
          </h2>
          <button onClick={closeCart} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-foreground font-medium mb-2">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
            <button
              onClick={closeCart}
              className="border border-foreground text-foreground px-6 py-3 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-[100px] flex-shrink-0 bg-background overflow-hidden">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground truncate mb-0.5">{item.title}</h3>
                    {item.variant_title && (
                      <p className="text-xs text-muted-foreground mb-1">{item.variant_title}</p>
                    )}
                    <p className="text-sm text-primary font-medium mb-2">{formatPrice(item.price)}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-xs font-medium text-foreground min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-5 space-y-4">

              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-primary">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground">Calculated at checkout</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full border border-foreground text-foreground py-3.5 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : `Checkout — ${formatPrice(total)}`}
              </button>

              <button
                onClick={closeCart}
                className="block w-full text-center text-xs uppercase tracking-button text-muted-foreground hover:text-foreground transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
