import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useSellQoCart } from '@/integrations/sellqo/CartContext';
import { useCustomerAuth } from '@/integrations/sellqo/CustomerAuthContext';
import { checkoutAPI } from '@/integrations/sellqo/api';
import { formatPrice } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const toFiniteNumber = (value: unknown, fallback: number): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const CheckoutAddress = () => {
  const navigate = useNavigate();
  const { items: cartItems, subtotal: cartSubtotal } = useSellQoCart();
  const { customer } = useCustomerAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Customer form
  const [customerForm, setCustomerForm] = useState({
    email: '', first_name: '', last_name: '', phone: '',
  });

  // Address form
  const [addressForm, setAddressForm] = useState({
    street: '', house_number: '', postal_code: '', city: '', country: 'BE', company: '',
  });
  const [billingSame, setBillingSame] = useState(true);
  const [billingForm, setBillingForm] = useState({
    street: '', house_number: '', postal_code: '', city: '', country: 'BE', company: '',
  });

  // Redirect if no cart
  useEffect(() => {
    const cartId = localStorage.getItem('mancini_cart_id');
    if (!cartId || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

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

  const handleSubmit = async () => {
    setFieldErrors({});
    if (!customerForm.email || !customerForm.first_name || !customerForm.last_name) {
      toast.error('Vul alle verplichte velden in');
      return;
    }
    if (!addressForm.street || !addressForm.postal_code || !addressForm.city) {
      toast.error('Vul alle adresvelden in');
      return;
    }

    setIsProcessing(true);
    const cartId = localStorage.getItem('mancini_cart_id');
    if (!cartId) return;

    try {
      // 1. Save customer
      const custRes = await checkoutAPI.saveCustomer(cartId, {
        email: customerForm.email,
        first_name: customerForm.first_name,
        last_name: customerForm.last_name,
        phone: customerForm.phone || undefined,
      });
      const custData = custRes as any;
      if (custData?.error?.code === 'VALIDATION_ERROR' && custData?.error?.fields) {
        setFieldErrors(custData.error.fields);
        setIsProcessing(false);
        return;
      }

      // 2. Save address
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

      const addrRes = await checkoutAPI.saveAddress(cartId, {
        shipping_address: shippingAddr,
        billing_same_as_shipping: billingSame,
        billing_address: billingAddr,
      });
      const addrData = addrRes as any;
      if (addrData?.error?.code === 'VALIDATION_ERROR' && addrData?.error?.fields) {
        setFieldErrors(addrData.error.fields);
        setIsProcessing(false);
        return;
      }

      // 3. Auto-select first shipping method
      try {
        const startRes = await checkoutAPI.start(cartId);
        const startData = (startRes as any)?.data || startRes;
        if (startData.available_shipping_methods?.length > 0) {
          await checkoutAPI.selectShipping(cartId, startData.available_shipping_methods[0].id);
        }
      } catch (e) {
        console.error('Auto-select shipping error:', e);
      }

      navigate('/checkout/payment');
    } catch (err: any) {
      console.error('Address submit error:', err);
      toast.error(err?.message || 'Kon gegevens niet opslaan. Probeer opnieuw.');
    } finally {
      setIsProcessing(false);
    }
  };

  const countries = [
    { code: 'BE', name: 'België' },
    { code: 'NL', name: 'Nederland' },
    { code: 'DE', name: 'Duitsland' },
    { code: 'FR', name: 'Frankrijk' },
    { code: 'LU', name: 'Luxemburg' },
    { code: 'GB', name: 'Verenigd Koninkrijk' },
    { code: 'IT', name: 'Italië' },
    { code: 'ES', name: 'Spanje' },
    { code: 'AT', name: 'Oostenrijk' },
    { code: 'US', name: 'Verenigde Staten' },
  ];

  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="font-heading text-3xl tracking-heading uppercase text-foreground mb-8 text-center">
          Checkout
        </h1>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {['Overzicht', 'Gegevens', 'Betaling'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                i <= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs uppercase tracking-button hidden sm:inline ${
                i <= 1 ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {label}
              </span>
              {i < 2 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          <div className="space-y-8">
            {/* Customer info */}
            <div className="space-y-4">
              <h2 className="text-sm uppercase tracking-button font-medium text-foreground">Jouw gegevens</h2>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">E-mail *</label>
                <Input type="email" value={customerForm.email} onChange={e => setCustomerForm(p => ({ ...p, email: e.target.value }))} />
                {fieldErrors.email && <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Voornaam *</label>
                  <Input value={customerForm.first_name} onChange={e => setCustomerForm(p => ({ ...p, first_name: e.target.value }))} />
                  {fieldErrors.first_name && <p className="text-xs text-destructive mt-1">{fieldErrors.first_name}</p>}
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Achternaam *</label>
                  <Input value={customerForm.last_name} onChange={e => setCustomerForm(p => ({ ...p, last_name: e.target.value }))} />
                  {fieldErrors.last_name && <p className="text-xs text-destructive mt-1">{fieldErrors.last_name}</p>}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Telefoon (optioneel)</label>
                <Input value={customerForm.phone} onChange={e => setCustomerForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>

            {/* Shipping address */}
            <div className="space-y-4">
              <h2 className="text-sm uppercase tracking-button font-medium text-foreground">Verzendadres</h2>
              <div className="grid grid-cols-[1fr_120px] gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Straat *</label>
                  <Input value={addressForm.street} onChange={e => setAddressForm(p => ({ ...p, street: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Nr.</label>
                  <Input value={addressForm.house_number} onChange={e => setAddressForm(p => ({ ...p, house_number: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Postcode *</label>
                  <Input value={addressForm.postal_code} onChange={e => setAddressForm(p => ({ ...p, postal_code: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Stad *</label>
                  <Input value={addressForm.city} onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Land *</label>
                <select
                  value={addressForm.country}
                  onChange={e => setAddressForm(p => ({ ...p, country: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Bedrijf (optioneel)</label>
                <Input value={addressForm.company} onChange={e => setAddressForm(p => ({ ...p, company: e.target.value }))} />
              </div>
            </div>

            {/* Billing toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={billingSame} onChange={e => setBillingSame(e.target.checked)} className="accent-primary" />
              <span className="text-sm text-foreground">Factuuradres is hetzelfde als verzendadres</span>
            </label>

            {!billingSame && (
              <div className="space-y-4 border-t border-border pt-4">
                <h3 className="text-sm uppercase tracking-button font-medium text-foreground">Factuuradres</h3>
                <div className="grid grid-cols-[1fr_120px] gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Straat *</label>
                    <Input value={billingForm.street} onChange={e => setBillingForm(p => ({ ...p, street: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Nr.</label>
                    <Input value={billingForm.house_number} onChange={e => setBillingForm(p => ({ ...p, house_number: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Postcode *</label>
                    <Input value={billingForm.postal_code} onChange={e => setBillingForm(p => ({ ...p, postal_code: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Stad *</label>
                    <Input value={billingForm.city} onChange={e => setBillingForm(p => ({ ...p, city: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Land *</label>
                  <select
                    value={billingForm.country}
                    onChange={e => setBillingForm(p => ({ ...p, country: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="w-full border border-foreground text-foreground py-3.5 text-xs uppercase tracking-button font-medium hover:bg-foreground hover:text-background transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
              Doorgaan naar betaling
            </button>

            <button
              onClick={() => navigate('/checkout')}
              className="flex items-center gap-1 text-xs uppercase tracking-button text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-3 w-3" /> Terug naar overzicht
            </button>
          </div>

          {/* Order summary sidebar */}
          <div className="order-first lg:order-last">
            <div className="border border-border p-5 space-y-4">
              <h3 className="text-sm uppercase tracking-button font-medium text-foreground">Overzicht</h3>
              <div className="divide-y divide-border">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-3 py-3 first:pt-0">
                    {item.image && (
                      <div className="w-14 h-18 bg-card overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{item.title}</p>
                      {item.variant_title && <p className="text-xs text-muted-foreground">{item.variant_title}</p>}
                      <p className="text-xs text-muted-foreground">Aantal: {item.quantity}</p>
                    </div>
                    <p className="text-sm text-foreground">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotaal</span>
                  <span className="text-foreground">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-medium">
                  <span>Totaal</span>
                  <span className="text-lg">{formatPrice(cartSubtotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CheckoutAddress;
