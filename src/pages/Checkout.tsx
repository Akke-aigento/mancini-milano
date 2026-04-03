import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2, Tag, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useSellQoCart } from '@/integrations/sellqo/CartContext';
import { useCustomerAuth } from '@/integrations/sellqo/CustomerAuthContext';
import { checkoutAPI } from '@/integrations/sellqo/api';
import { formatPrice } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

type Step = 'customer' | 'address' | 'shipping' | 'payment';

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

interface CheckoutData {
  orderId: string;
  items: Array<{ id: string; title: string; variant_title?: string; quantity: number; price: number; image?: string }>;
  availablePaymentMethods: PaymentMethod[];
  availableShippingMethods: ShippingMethod[];
  subtotal: number;
  total: number;
  currency: string;
  shippingCost: number;
  discount: { code: string; amount: number } | null;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items: cartItems, subtotal: cartSubtotal, cart, clearCart } = useSellQoCart();
  const { customer } = useCustomerAuth();

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<Step>('customer');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Customer form
  const [customerForm, setCustomerForm] = useState({
    email: customer?.email || '',
    first_name: customer?.first_name || '',
    last_name: customer?.last_name || '',
    phone: customer?.phone || '',
  });

  // Address form
  const defaultAddr = customer?.addresses?.[0];
  const [addressForm, setAddressForm] = useState({
    street: defaultAddr?.street || '',
    house_number: defaultAddr?.house_number || '',
    postal_code: defaultAddr?.postal_code || '',
    city: defaultAddr?.city || '',
    country: defaultAddr?.country || 'BE',
    company: '',
  });
  const [billingSame, setBillingSame] = useState(true);
  const [billingForm, setBillingForm] = useState({
    street: '', house_number: '', postal_code: '', city: '', country: 'BE', company: '',
  });

  // Shipping & Payment selections
  const [selectedShipping, setSelectedShipping] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');

  // Discount
  const [discountInput, setDiscountInput] = useState('');

  // Pre-fill from customer
  useEffect(() => {
    if (customer) {
      const addr = customer.addresses?.[0];
      setCustomerForm(prev => ({
        email: prev.email || customer.email || '',
        first_name: prev.first_name || customer.first_name || '',
        last_name: prev.last_name || customer.last_name || '',
        phone: prev.phone || customer.phone || '',
      }));
      if (addr) {
        setAddressForm(prev => ({
          street: prev.street || addr.street || '',
          house_number: prev.house_number || addr.house_number || '',
          postal_code: prev.postal_code || addr.postal_code || '',
          city: prev.city || addr.city || '',
          country: prev.country || addr.country || 'BE',
          company: prev.company || '',
        }));
      }
    }
  }, [customer]);

  // Initialize checkout
  useEffect(() => {
    const initCheckout = async () => {
      const cartId = localStorage.getItem('mancini_cart_id');
      if (!cartId || cartItems.length === 0) {
        navigate('/cart');
        return;
      }

      try {
        const res = await checkoutAPI.start(cartId);
        const data = res as any;
        const result = data?.data || data;
        
        setCheckoutData({
          orderId: result.order_id,
          items: result.items || cartItems.map(i => ({ id: i.id, title: i.title, variant_title: i.variant_title, quantity: i.quantity, price: i.price, image: i.image })),
          availablePaymentMethods: result.available_payment_methods || [],
          availableShippingMethods: result.available_shipping_methods || [],
          subtotal: result.subtotal || cartSubtotal,
          total: result.total || cartSubtotal,
          currency: result.currency || 'EUR',
          shippingCost: 0,
          discount: null,
        });

        if (result.available_shipping_methods?.length > 0) {
          setSelectedShipping(result.available_shipping_methods[0].id);
        }
        if (result.available_payment_methods?.length > 0) {
          setSelectedPayment(result.available_payment_methods[0].id || result.available_payment_methods[0].type);
        }
      } catch (err) {
        console.error('Checkout start error:', err);
        toast.error('Could not start checkout. Please try again.');
        navigate('/cart');
      } finally {
        setIsInitializing(false);
      }
    };

    initCheckout();
  }, []);

  // Determine visible steps
  const hasShipping = (checkoutData?.availableShippingMethods?.length || 0) > 0;
  const visibleSteps: Step[] = hasShipping
    ? ['customer', 'address', 'shipping', 'payment']
    : ['customer', 'address', 'payment'];

  const stepLabels: Record<Step, string> = {
    customer: 'Details',
    address: 'Address',
    shipping: 'Shipping',
    payment: 'Payment',
  };

  const stepIndex = visibleSteps.indexOf(step);

  const goNext = () => {
    const next = visibleSteps[stepIndex + 1];
    if (next) setStep(next);
  };

  const goBack = () => {
    const prev = visibleSteps[stepIndex - 1];
    if (prev) setStep(prev);
  };

  // Step handlers
  const handleCustomerSubmit = async () => {
    setFieldErrors({});
    if (!customerForm.email || !customerForm.first_name || !customerForm.last_name) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!checkoutData) return;

    setIsProcessing(true);
    try {
      const res = await checkoutAPI.saveCustomer(checkoutData.orderId, {
        email: customerForm.email,
        first_name: customerForm.first_name,
        last_name: customerForm.last_name,
        phone: customerForm.phone || undefined,
      });
      const data = res as any;
      if (data?.error?.code === 'VALIDATION_ERROR' && data?.error?.fields) {
        setFieldErrors(data.error.fields);
        return;
      }
      goNext();
    } catch (err: any) {
      console.error('Save customer error:', err);
      toast.error(err?.message || 'Could not save details. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddressSubmit = async () => {
    setFieldErrors({});
    if (!addressForm.street || !addressForm.postal_code || !addressForm.city) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!checkoutData) return;

    setIsProcessing(true);
    try {
      const shippingAddr: Record<string, string> = {
        street: `${addressForm.street} ${addressForm.house_number}`.trim(),
        city: addressForm.city,
        postal_code: addressForm.postal_code,
        country: addressForm.country,
      };
      if (addressForm.company) shippingAddr.company = addressForm.company;

      let billingAddr: Record<string, string> | null = null;
      if (!billingSame) {
        billingAddr = {
          street: `${billingForm.street} ${billingForm.house_number}`.trim(),
          city: billingForm.city,
          postal_code: billingForm.postal_code,
          country: billingForm.country,
        };
        if (billingForm.company) billingAddr.company = billingForm.company;
      }

      const res = await checkoutAPI.saveAddress(checkoutData.orderId, {
        shipping_address: shippingAddr,
        billing_same_as_shipping: billingSame,
        billing_address: billingAddr,
      });
      const data = res as any;
      if (data?.error?.code === 'VALIDATION_ERROR' && data?.error?.fields) {
        setFieldErrors(data.error.fields);
        return;
      }

      // Auto-select shipping if only 1 method
      if (hasShipping && checkoutData.availableShippingMethods.length === 1) {
        const shipRes = await checkoutAPI.selectShipping(
          checkoutData.orderId,
          checkoutData.availableShippingMethods[0].id
        );
        const shipData = shipRes as any;
        const shipResult = shipData?.data || shipData;
        setCheckoutData(prev => prev ? {
          ...prev,
          shippingCost: shipResult.shipping_cost ?? 0,
          total: shipResult.total ?? prev.total,
        } : prev);
        // Skip shipping step, go to payment
        setStep('payment');
        return;
      }

      goNext();
    } catch (err: any) {
      console.error('Save address error:', err);
      toast.error(err?.message || 'Could not save address. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShippingSubmit = async () => {
    if (!checkoutData || !selectedShipping) return;

    setIsProcessing(true);
    try {
      const res = await checkoutAPI.selectShipping(checkoutData.orderId, selectedShipping);
      const data = res as any;
      const result = data?.data || data;
      setCheckoutData(prev => prev ? {
        ...prev,
        shippingCost: result.shipping_cost ?? 0,
        total: result.total ?? prev.total,
      } : prev);
      goNext();
    } catch (err: any) {
      console.error('Select shipping error:', err);
      toast.error(err?.message || 'Could not select shipping. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteOrder = async () => {
    if (!checkoutData || !selectedPayment) return;

    setIsProcessing(true);
    try {
      const successUrl = `${window.location.origin}/checkout/success`;
      const cancelUrl = `${window.location.origin}/cart`;

      const res = await checkoutAPI.complete(checkoutData.orderId, selectedPayment, successUrl, cancelUrl);
      const data = res as any;
      const result = data?.data || data;

      clearCart();

      switch (result.payment_type) {
        case 'redirect':
          window.location.href = result.checkout_url;
          break;
        case 'manual':
          navigate('/checkout/success', {
            state: {
              orderNumber: result.order_number,
              total: result.total,
              currency: result.currency,
              bankDetails: result.bank_details,
              paymentType: 'manual',
            },
          });
          break;
        case 'qr':
          navigate('/checkout/success', {
            state: {
              orderNumber: result.order_number,
              total: result.total,
              currency: result.currency,
              qrData: result.qr_data,
              paymentType: 'qr',
            },
          });
          break;
        default:
          // Fallback — treat as redirect if checkout_url exists
          if (result.checkout_url) {
            window.location.href = result.checkout_url;
          } else {
            navigate('/checkout/success', {
              state: { orderNumber: result.order_number, paymentType: 'manual' },
            });
          }
      }
    } catch (err: any) {
      console.error('Complete checkout error:', err);
      toast.error(err?.message || 'Could not complete order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyDiscount = async () => {
    if (!checkoutData || !discountInput.trim()) return;
    try {
      const res = await checkoutAPI.applyDiscount(checkoutData.orderId, discountInput.trim());
      const data = res as any;
      const result = data?.data || data;
      if (data?.error) {
        toast.error(data.error.message || 'Invalid discount code');
        return;
      }
      setCheckoutData(prev => prev ? {
        ...prev,
        discount: { code: result.discount_code, amount: result.discount_amount },
        total: result.total,
      } : prev);
      setDiscountInput('');
      toast.success('Discount applied!');
    } catch (err: any) {
      toast.error(err?.message || 'Invalid discount code');
    }
  };

  const handleRemoveDiscount = async () => {
    if (!checkoutData) return;
    try {
      const res = await checkoutAPI.removeDiscount(checkoutData.orderId);
      const data = res as any;
      const result = data?.data || data;
      setCheckoutData(prev => prev ? {
        ...prev,
        discount: null,
        total: result.total ?? prev.subtotal,
      } : prev);
    } catch { /* noop */ }
  };

  if (isInitializing) {
    return (
      <Layout>
        <section className="max-w-5xl mx-auto px-4 lg:px-8 py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </section>
      </Layout>
    );
  }

  if (!checkoutData) return null;

  const displayItems = checkoutData.items.length > 0 ? checkoutData.items : cartItems;

  // Order summary sidebar
  const OrderSummary = () => (
    <div className="border border-border p-5 space-y-4">
      <h3 className="text-sm uppercase tracking-button font-medium text-foreground">Order Summary</h3>

      <div className="divide-y divide-border">
        {displayItems.map(item => (
          <div key={item.id} className="flex gap-3 py-3 first:pt-0">
            {(item as any).image && (
              <div className="w-14 h-18 bg-card overflow-hidden flex-shrink-0">
                <img src={(item as any).image} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{item.title}</p>
              {item.variant_title && <p className="text-xs text-muted-foreground">{item.variant_title}</p>}
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm text-foreground">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      {/* Discount code */}
      <div className="flex gap-2">
        <Input
          placeholder="Discount code"
          value={discountInput}
          onChange={e => setDiscountInput(e.target.value)}
          className="text-sm"
        />
        <button
          onClick={handleApplyDiscount}
          className="px-4 border border-foreground text-foreground text-xs uppercase tracking-button hover:bg-foreground hover:text-background transition-colors"
        >
          Apply
        </button>
      </div>

      {checkoutData.discount && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5">
            <Tag className="h-3 w-3 text-primary" />
            <span className="text-primary">{checkoutData.discount.code}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">-{formatPrice(checkoutData.discount.amount)}</span>
            <button onClick={handleRemoveDiscount}><X className="h-3 w-3 text-muted-foreground hover:text-foreground" /></button>
          </div>
        </div>
      )}

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">{formatPrice(checkoutData.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-foreground">
            {checkoutData.shippingCost > 0 ? formatPrice(checkoutData.shippingCost) : step === 'customer' || step === 'address' ? 'Calculated next' : 'Free'}
          </span>
        </div>
        <div className="border-t border-border pt-2 flex justify-between font-medium">
          <span>Total</span>
          <span className="text-lg">{formatPrice(checkoutData.total)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="font-heading text-3xl tracking-heading uppercase text-foreground mb-8 text-center">
          Checkout
        </h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {visibleSteps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                i <= stepIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs uppercase tracking-button hidden sm:inline ${
                i <= stepIndex ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {stepLabels[s]}
              </span>
              {i < visibleSteps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Main content */}
          <div>
            {/* Step: Customer */}
            {step === 'customer' && (
              <div className="space-y-6">
                <h2 className="text-sm uppercase tracking-button font-medium text-foreground mb-4">Your Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">First Name *</label>
                    <Input value={customerForm.first_name} onChange={e => setCustomerForm(p => ({ ...p, first_name: e.target.value }))} />
                    {fieldErrors.first_name && <p className="text-xs text-destructive mt-1">{fieldErrors.first_name}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Last Name *</label>
                    <Input value={customerForm.last_name} onChange={e => setCustomerForm(p => ({ ...p, last_name: e.target.value }))} />
                    {fieldErrors.last_name && <p className="text-xs text-destructive mt-1">{fieldErrors.last_name}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Email *</label>
                    <Input type="email" value={customerForm.email} onChange={e => setCustomerForm(p => ({ ...p, email: e.target.value }))} />
                    {fieldErrors.email && <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
                    <Input value={customerForm.phone} onChange={e => setCustomerForm(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                </div>
                <button
                  onClick={handleCustomerSubmit}
                  disabled={isProcessing}
                  className="w-full border border-foreground text-foreground py-3.5 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                  Continue to Address
                </button>
              </div>
            )}

            {/* Step: Address */}
            {step === 'address' && (
              <div className="space-y-6">
                <h2 className="text-sm uppercase tracking-button font-medium text-foreground mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">Company (optional)</label>
                    <Input value={addressForm.company} onChange={e => setAddressForm(p => ({ ...p, company: e.target.value }))} />
                  </div>
                  <div className="sm:col-span-2 grid grid-cols-[1fr_120px] gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Street *</label>
                      <Input value={addressForm.street} onChange={e => setAddressForm(p => ({ ...p, street: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Nr.</label>
                      <Input value={addressForm.house_number} onChange={e => setAddressForm(p => ({ ...p, house_number: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Postal Code *</label>
                    <Input value={addressForm.postal_code} onChange={e => setAddressForm(p => ({ ...p, postal_code: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">City *</label>
                    <Input value={addressForm.city} onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Country *</label>
                    <select
                      value={addressForm.country}
                      onChange={e => setAddressForm(p => ({ ...p, country: e.target.value }))}
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

                {/* Billing toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={billingSame} onChange={e => setBillingSame(e.target.checked)} className="accent-primary" />
                  <span className="text-sm text-foreground">Billing address is the same as shipping</span>
                </label>

                {!billingSame && (
                  <div className="space-y-4 border-t border-border pt-4">
                    <h3 className="text-sm uppercase tracking-button font-medium text-foreground">Billing Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs text-muted-foreground mb-1 block">Company (optional)</label>
                        <Input value={billingForm.company} onChange={e => setBillingForm(p => ({ ...p, company: e.target.value }))} />
                      </div>
                      <div className="sm:col-span-2 grid grid-cols-[1fr_120px] gap-4">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Street *</label>
                          <Input value={billingForm.street} onChange={e => setBillingForm(p => ({ ...p, street: e.target.value }))} />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Nr.</label>
                          <Input value={billingForm.house_number} onChange={e => setBillingForm(p => ({ ...p, house_number: e.target.value }))} />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Postal Code *</label>
                        <Input value={billingForm.postal_code} onChange={e => setBillingForm(p => ({ ...p, postal_code: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">City *</label>
                        <Input value={billingForm.city} onChange={e => setBillingForm(p => ({ ...p, city: e.target.value }))} />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Country *</label>
                        <select
                          value={billingForm.country}
                          onChange={e => setBillingForm(p => ({ ...p, country: e.target.value }))}
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
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={goBack}
                    className="flex items-center gap-1 px-4 py-3 text-xs uppercase tracking-button font-medium border border-border text-foreground hover:border-muted-foreground transition-colors"
                  >
                    <ChevronLeft className="h-3 w-3" /> Back
                  </button>
                  <button
                    onClick={handleAddressSubmit}
                    disabled={isProcessing}
                    className="flex-1 border border-foreground text-foreground py-3.5 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                    {hasShipping ? 'Continue to Shipping' : 'Continue to Payment'}
                  </button>
                </div>
              </div>
            )}

            {/* Step: Shipping */}
            {step === 'shipping' && hasShipping && (
              <div className="space-y-6">
                <h2 className="text-sm uppercase tracking-button font-medium text-foreground mb-4">Shipping Method</h2>
                <div className="space-y-3">
                  {checkoutData.availableShippingMethods.map(method => (
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
                    onClick={goBack}
                    className="flex items-center gap-1 px-4 py-3 text-xs uppercase tracking-button font-medium border border-border text-foreground hover:border-muted-foreground transition-colors"
                  >
                    <ChevronLeft className="h-3 w-3" /> Back
                  </button>
                  <button
                    onClick={handleShippingSubmit}
                    disabled={isProcessing}
                    className="flex-1 border border-foreground text-foreground py-3.5 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step: Payment */}
            {step === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-sm uppercase tracking-button font-medium text-foreground mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {checkoutData.availablePaymentMethods.map(method => (
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
                    onClick={goBack}
                    className="flex items-center gap-1 px-4 py-3 text-xs uppercase tracking-button font-medium border border-border text-foreground hover:border-muted-foreground transition-colors"
                  >
                    <ChevronLeft className="h-3 w-3" /> Back
                  </button>
                  <button
                    onClick={handleCompleteOrder}
                    disabled={isProcessing}
                    className="flex-1 border border-foreground text-foreground py-3.5 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="order-first lg:order-last">
            <OrderSummary />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
