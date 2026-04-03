import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useSellQoCart } from '@/integrations/sellqo/CartContext';
import { useCustomerAuth } from '@/integrations/sellqo/CustomerAuthContext';
import { checkoutAPI } from '@/integrations/sellqo/api';
import { formatPrice } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type Step = 'address' | 'shipping' | 'payment' | 'review';
const STEPS: Step[] = ['address', 'shipping', 'payment', 'review'];
const STEP_LABELS: Record<Step, string> = {
  address: 'Address',
  shipping: 'Shipping',
  payment: 'Payment',
  review: 'Review',
};

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimated_days?: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  description?: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, total, cart, clearCart } = useSellQoCart();
  const { customer } = useCustomerAuth();

  const [step, setStep] = useState<Step>('address');
  const [isProcessing, setIsProcessing] = useState(false);

  // Address form
  const defaultAddr = customer?.addresses?.[0];
  const [address, setAddress] = useState({
    first_name: customer?.first_name || '',
    last_name: customer?.last_name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    street: defaultAddr?.street || '',
    house_number: defaultAddr?.house_number || '',
    postal_code: defaultAddr?.postal_code || '',
    city: defaultAddr?.city || '',
    country: defaultAddr?.country || 'BE',
  });

  // Shipping
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState('');
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Payment
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Pre-fill from customer when it loads
  useEffect(() => {
    if (customer) {
      const addr = customer.addresses?.[0];
      setAddress(prev => ({
        first_name: prev.first_name || customer.first_name || '',
        last_name: prev.last_name || customer.last_name || '',
        email: prev.email || customer.email || '',
        phone: prev.phone || customer.phone || '',
        street: prev.street || addr?.street || '',
        house_number: prev.house_number || addr?.house_number || '',
        postal_code: prev.postal_code || addr?.postal_code || '',
        city: prev.city || addr?.city || '',
        country: prev.country || addr?.country || 'BE',
      }));
    }
  }, [customer]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) navigate('/cart');
  }, [items.length, navigate]);

  const cartId = (() => {
    try { return localStorage.getItem('mancini_cart_id'); } catch { return null; }
  })();

  const handleAddressSubmit = async () => {
    if (!address.first_name || !address.last_name || !address.email || !address.street || !address.postal_code || !address.city) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!cartId) { toast.error('Cart not found'); return; }

    setLoadingShipping(true);
    try {
      const res = await checkoutAPI.getShippingOptions(cartId, address.country, subtotal);
      const methods = res?.shipping_methods || [];
      setShippingMethods(methods);
      if (methods.length > 0) setSelectedShipping(methods[0].id);
      setStep('shipping');
    } catch (err) {
      console.error('Shipping options error:', err);
      // If no shipping options endpoint, skip to payment
      setShippingMethods([{ id: 'standard', name: 'Standard Shipping', price: 0 }]);
      setSelectedShipping('standard');
      setStep('shipping');
    } finally {
      setLoadingShipping(false);
    }
  };

  const handleShippingSubmit = async () => {
    if (!cartId) return;
    setLoadingPayment(true);
    try {
      const res = await checkoutAPI.getPaymentMethods(cartId);
      const methods = res?.payment_methods || [];
      setPaymentMethods(methods);
      if (methods.length > 0) setSelectedPayment(methods[0].id || methods[0].type);
      setStep('payment');
    } catch (err) {
      console.error('Payment methods error:', err);
      // Default to stripe if endpoint not available
      setPaymentMethods([{ id: 'stripe', type: 'stripe', name: 'Online Payment (Card)' }]);
      setSelectedPayment('stripe');
      setStep('payment');
    } finally {
      setLoadingPayment(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!cartId) return;
    setIsProcessing(true);
    try {
      const result = await checkoutAPI.placeOrder({
        cart_id: cartId,
        shipping_address: {
          first_name: address.first_name,
          last_name: address.last_name,
          street: address.street,
          house_number: address.house_number,
          postal_code: address.postal_code,
          city: address.city,
          country: address.country,
        },
        email: address.email,
        phone: address.phone,
        shipping_method_id: selectedShipping,
        payment_method: selectedPayment,
        origin: window.location.origin,
      });

      if (result.payment_url) {
        // Stripe redirect
        clearCart();
        window.location.href = result.payment_url;
      } else {
        // Bank transfer or direct confirmation
        clearCart();
        navigate(`/checkout/success?order_id=${result.order_id}`);
      }
    } catch (err: unknown) {
      console.error('Place order error:', err);
      toast.error(err instanceof Error ? err.message : 'Could not place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedShippingMethod = shippingMethods.find(m => m.id === selectedShipping);
  const shippingCost = selectedShippingMethod?.price || 0;
  const orderTotal = subtotal + shippingCost - (cart?.discount || 0);

  const stepIndex = STEPS.indexOf(step);

  return (
    <Layout>
      <section className="max-w-3xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="font-heading text-3xl tracking-heading uppercase text-foreground mb-8 text-center">
          Checkout
        </h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                i <= stepIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs uppercase tracking-button hidden sm:inline ${
                i <= stepIndex ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {STEP_LABELS[s]}
              </span>
              {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        {/* Step 1: Address */}
        {step === 'address' && (
          <div className="space-y-6">
            <h2 className="text-sm uppercase tracking-button font-medium text-foreground mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">First Name *</label>
                <Input value={address.first_name} onChange={e => setAddress(p => ({ ...p, first_name: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Last Name *</label>
                <Input value={address.last_name} onChange={e => setAddress(p => ({ ...p, last_name: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email *</label>
                <Input type="email" value={address.email} onChange={e => setAddress(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
                <Input value={address.phone} onChange={e => setAddress(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="sm:col-span-2 grid grid-cols-[1fr_120px] gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Street *</label>
                  <Input value={address.street} onChange={e => setAddress(p => ({ ...p, street: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Nr.</label>
                  <Input value={address.house_number} onChange={e => setAddress(p => ({ ...p, house_number: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Postal Code *</label>
                <Input value={address.postal_code} onChange={e => setAddress(p => ({ ...p, postal_code: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">City *</label>
                <Input value={address.city} onChange={e => setAddress(p => ({ ...p, city: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Country *</label>
                <select
                  value={address.country}
                  onChange={e => setAddress(p => ({ ...p, country: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="BE">Belgium</option>
                  <option value="NL">Netherlands</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="LU">Luxembourg</option>
                  <option value="GB">United Kingdom</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="AT">Austria</option>
                  <option value="US">United States</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleAddressSubmit}
              disabled={loadingShipping}
              className="w-full border border-foreground text-foreground py-3.5 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingShipping ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Continue to Shipping
            </button>
          </div>
        )}

        {/* Step 2: Shipping */}
        {step === 'shipping' && (
          <div className="space-y-6">
            <h2 className="text-sm uppercase tracking-button font-medium text-foreground mb-4">Shipping Method</h2>
            <div className="space-y-3">
              {shippingMethods.map(method => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
                    selectedShipping === method.id ? 'border-primary bg-card' : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      checked={selectedShipping === method.id}
                      onChange={() => setSelectedShipping(method.id)}
                      className="accent-primary"
                    />
                    <div>
                      <span className="text-sm font-medium text-foreground">{method.name}</span>
                      {method.estimated_days && (
                        <span className="text-xs text-muted-foreground ml-2">({method.estimated_days})</span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {method.price === 0 ? 'Free' : formatPrice(method.price)}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep('address')}
                className="flex items-center gap-1 px-4 py-3 text-xs uppercase tracking-button font-medium border border-border text-foreground hover:border-muted-foreground transition-colors"
              >
                <ChevronLeft className="h-3 w-3" /> Back
              </button>
              <button
                onClick={handleShippingSubmit}
                disabled={loadingPayment}
                className="flex-1 border border-foreground text-foreground py-3.5 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loadingPayment ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 'payment' && (
          <div className="space-y-6">
            <h2 className="text-sm uppercase tracking-button font-medium text-foreground mb-4">Payment Method</h2>
            <div className="space-y-3">
              {paymentMethods.map(method => (
                <label
                  key={method.id || method.type}
                  className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                    selectedPayment === (method.id || method.type) ? 'border-primary bg-card' : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id || method.type}
                    checked={selectedPayment === (method.id || method.type)}
                    onChange={() => setSelectedPayment(method.id || method.type)}
                    className="accent-primary"
                  />
                  <div>
                    <span className="text-sm font-medium text-foreground">{method.name}</span>
                    {method.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{method.description}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep('shipping')}
                className="flex items-center gap-1 px-4 py-3 text-xs uppercase tracking-button font-medium border border-border text-foreground hover:border-muted-foreground transition-colors"
              >
                <ChevronLeft className="h-3 w-3" /> Back
              </button>
              <button
                onClick={() => setStep('review')}
                className="flex-1 border border-foreground text-foreground py-3.5 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors"
              >
                Review Order
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 'review' && (
          <div className="space-y-6">
            <h2 className="text-sm uppercase tracking-button font-medium text-foreground mb-4">Order Review</h2>

            {/* Address summary */}
            <div className="border border-border p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs uppercase tracking-button text-muted-foreground">Ship To</span>
                <button onClick={() => setStep('address')} className="text-xs text-primary hover:underline">Edit</button>
              </div>
              <p className="text-sm text-foreground">
                {address.first_name} {address.last_name}<br />
                {address.street} {address.house_number}<br />
                {address.postal_code} {address.city}, {address.country}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{address.email}</p>
            </div>

            {/* Shipping & Payment summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-border p-4">
                <span className="text-xs uppercase tracking-button text-muted-foreground block mb-2">Shipping</span>
                <p className="text-sm text-foreground">{selectedShippingMethod?.name || 'Standard'}</p>
                <p className="text-xs text-primary">{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</p>
              </div>
              <div className="border border-border p-4">
                <span className="text-xs uppercase tracking-button text-muted-foreground block mb-2">Payment</span>
                <p className="text-sm text-foreground">
                  {paymentMethods.find(m => (m.id || m.type) === selectedPayment)?.name || selectedPayment}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="border border-border divide-y divide-border">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 p-4">
                  <div className="w-16 h-20 bg-card overflow-hidden flex-shrink-0">
                    {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                    {item.variant_title && <p className="text-xs text-muted-foreground">{item.variant_title}</p>}
                    <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-foreground">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border border-border p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatPrice(subtotal)}</span>
              </div>
              {(cart?.discount || 0) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-primary">-{formatPrice(cart!.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="text-sm font-medium text-foreground">Total</span>
                <span className="text-lg font-medium text-foreground">{formatPrice(orderTotal)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('payment')}
                className="flex items-center gap-1 px-4 py-3 text-xs uppercase tracking-button font-medium border border-border text-foreground hover:border-muted-foreground transition-colors"
              >
                <ChevronLeft className="h-3 w-3" /> Back
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="flex-1 border border-foreground text-foreground py-3.5 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Place Order
              </button>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Checkout;
