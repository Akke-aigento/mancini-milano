import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { formatPrice } from '@/components/ProductCard';

const CartDrawer = () => {
  const {
    items, itemCount, subtotal, discount, discountCode,
    isDrawerOpen, closeDrawer,
    updateItem, removeItem, applyCode, checkout, loading,
  } = useCart();
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [codeSuccess, setCodeSuccess] = useState(false);

  const handleApplyCode = async () => {
    if (!code.trim()) return;
    setCodeError(false);
    setCodeSuccess(false);
    const ok = await applyCode(code.trim());
    if (ok) {
      setCodeSuccess(true);
      setCode('');
    } else {
      setCodeError(true);
    }
  };

  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-card border-l border-border flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-sm uppercase tracking-button font-medium text-foreground">
            Cart ({itemCount})
          </h2>
          <button onClick={closeDrawer} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-foreground font-medium mb-2">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
            <button
              onClick={closeDrawer}
              className="bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-button font-medium hover:bg-gold-hover transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-[100px] flex-shrink-0 bg-background overflow-hidden">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground truncate mb-0.5">{item.title}</h3>
                    {(item.size || item.color) && (
                      <p className="text-xs text-muted-foreground mb-1">
                        {[item.size, item.color].filter(Boolean).join(' / ')}
                      </p>
                    )}
                    <p className="text-sm text-primary font-medium mb-2">{formatPrice(item.price)}</p>

                    <div className="flex items-center justify-between">
                      {/* Quantity */}
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateItem(item.id, item.quantity - 1)}
                          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-xs font-medium text-foreground min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Remove */}
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

            {/* Footer */}
            <div className="border-t border-border p-5 space-y-4">
              {/* Discount code */}
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setCodeError(false); setCodeSuccess(false); }}
                    placeholder="Discount code"
                    className="flex-1 bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={handleApplyCode}
                    className="px-4 py-2 text-xs uppercase tracking-button font-medium border border-border text-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {codeError && <p className="text-xs text-destructive mt-1">Invalid discount code</p>}
                {codeSuccess && <p className="text-xs text-primary mt-1">Discount applied!</p>}
                {discountCode && !codeSuccess && (
                  <p className="text-xs text-primary mt-1">Code "{discountCode}" applied ({Math.round(discount * 100)}% off)</p>
                )}
              </div>

              {/* Totals */}
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
                  <span className="text-primary">Free</span>
                </div>
              </div>

              {/* Checkout */}
              <button
                onClick={checkout}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3.5 text-xs uppercase tracking-button font-medium hover:bg-gold-hover transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Checkout — ${formatPrice(total)}`}
              </button>

              <Link
                to="/cart"
                onClick={closeDrawer}
                className="block text-center text-xs uppercase tracking-button text-muted-foreground hover:text-foreground transition-colors"
              >
                View Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
