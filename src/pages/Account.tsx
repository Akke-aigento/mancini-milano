import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth, Address } from "@/integrations/sellqo/CustomerAuthContext";
import { customerApiFetch } from "@/integrations/sellqo/customerClient";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, User, ShoppingBag, Lock, LogOut, MapPin } from "lucide-react";
import { toast } from "sonner";

const tabs = [
  { id: "profile" as const, icon: User, label: "Profile" },
  { id: "address" as const, icon: MapPin, label: "Address" },
  { id: "orders" as const, icon: ShoppingBag, label: "Orders" },
  { id: "password" as const, icon: Lock, label: "Password" },
];

type TabId = typeof tabs[number]["id"];

const inputClasses = "bg-secondary/50 border-border/50 h-12 text-foreground";

/* ─── Profile Tab ─── */
const ProfileTab = () => {
  const { customer, updateProfile } = useCustomerAuth();
  const [firstName, setFirstName] = useState(customer?.first_name || "");
  const [lastName, setLastName] = useState(customer?.last_name || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [newsletter, setNewsletter] = useState(customer?.newsletter || false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ first_name: firstName, last_name: lastName, phone, newsletter });
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-md">
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
        <Input value={customer?.email || ""} disabled className={`${inputClasses} opacity-60`} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">First Name</Label>
          <Input value={firstName} onChange={e => setFirstName(e.target.value)} className={inputClasses} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Last Name</Label>
          <Input value={lastName} onChange={e => setLastName(e.target.value)} className={inputClasses} />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Phone</Label>
        <Input value={phone} onChange={e => setPhone(e.target.value)} className={inputClasses} />
      </div>
      <div className="flex items-center justify-between py-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Newsletter</Label>
        <Switch checked={newsletter} onCheckedChange={setNewsletter} />
      </div>
      <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90 h-12" disabled={saving}>
        {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
        Save
      </Button>
    </form>
  );
};

/* ─── Address Tab ─── */
const AddressTab = () => {
  const { customer, token, refreshProfile } = useCustomerAuth();
  const addr = customer?.addresses?.[0];
  const [street, setStreet] = useState(addr?.street || "");
  const [houseNumber, setHouseNumber] = useState(addr?.house_number || "");
  const [postalCode, setPostalCode] = useState(addr?.postal_code || "");
  const [city, setCity] = useState(addr?.city || "");
  const [country, setCountry] = useState(addr?.country || "Belgium");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (addr) {
      setStreet(addr.street || "");
      setHouseNumber(addr.house_number || "");
      setPostalCode(addr.postal_code || "");
      setCity(addr.city || "");
      setCountry(addr.country || "Belgium");
    }
  }, [addr]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const action = addr?.id ? "update_address" : "add_address";
      const payload: Record<string, unknown> = {
        street,
        house_number: houseNumber,
        postal_code: postalCode,
        city,
        country,
        is_default: true,
      };
      if (addr?.id) payload.address_id = addr.id;
      await customerApiFetch(action, payload, token);
      await refreshProfile();
      toast.success("Address saved");
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-md">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Street</Label>
          <Input value={street} onChange={e => setStreet(e.target.value)} className={inputClasses} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nr.</Label>
          <Input value={houseNumber} onChange={e => setHouseNumber(e.target.value)} className={inputClasses} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Postal Code</Label>
          <Input value={postalCode} onChange={e => setPostalCode(e.target.value)} className={inputClasses} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">City</Label>
          <Input value={city} onChange={e => setCity(e.target.value)} className={inputClasses} />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Country</Label>
        <Input value={country} onChange={e => setCountry(e.target.value)} className={inputClasses} />
      </div>
      <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90 h-12" disabled={saving}>
        {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
        Save
      </Button>
    </form>
  );
};

/* ─── Orders Tab ─── */
const OrdersTab = () => {
  const { token } = useCustomerAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    customerApiFetch<any[]>("get_orders", {}, token)
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-muted-foreground" size={24} /></div>;

  if (orders.length === 0) return (
    <div className="text-center py-12">
      <ShoppingBag className="mx-auto mb-4 text-muted-foreground" size={32} />
      <p className="text-muted-foreground">No orders yet</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {orders.map((order: any) => (
        <div key={order.id} className="border border-border/30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">#{order.order_number || order.id?.slice(0, 8)}</span>
            <span className="text-xs uppercase tracking-button text-muted-foreground">{order.status}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {order.total != null && <span>€{Number(order.total).toFixed(2)}</span>}
            {order.created_at && <span className="ml-4">{new Date(order.created_at).toLocaleDateString('nl-BE')}</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── Password Tab ─── */
const PasswordTab = () => {
  const { token } = useCustomerAuth();
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirm) { toast.error("Passwords do not match"); return; }
    if (newPw.length < 8) { toast.error("Minimum 8 characters"); return; }
    setSaving(true);
    try {
      await customerApiFetch("change_password", { current_password: current, new_password: newPw }, token);
      toast.success("Password changed");
      setCurrent(""); setNewPw(""); setConfirm("");
    } catch (err: any) {
      toast.error(err.message || "Change failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleChange} className="space-y-5 max-w-md">
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Current Password</Label>
        <Input type="password" value={current} onChange={e => setCurrent(e.target.value)} className={inputClasses} />
      </div>
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">New Password</Label>
        <Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 characters" className={inputClasses} />
      </div>
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Confirm New Password</Label>
        <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className={inputClasses} />
      </div>
      <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90 h-12" disabled={saving}>
        {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
        Change Password
      </Button>
    </form>
  );
};

/* ─── Main Account Page ─── */
const Account = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, customer, logout } = useCustomerAuth();
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/login", { state: { from: "/account" }, replace: true });
  }, [loading, isAuthenticated, navigate]);

  if (loading) return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    </Layout>
  );

  if (!isAuthenticated) return null;

  const handleLogout = () => { logout(); navigate("/"); };
  const initials = `${customer?.first_name?.[0] || ""}${customer?.last_name?.[0] || ""}`.toUpperCase();

  return (
    <Layout>
      <SEO title="Mijn Account — Mancini Milano" description="Beheer je account bij Mancini Milano." />
      <div className="max-w-site mx-auto px-4 lg:px-8 py-12 lg:py-16">
        {/* Header */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center">
            <span className="font-heading text-xl text-foreground">{initials}</span>
          </div>
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl uppercase tracking-logo text-foreground">My Account</h1>
            <p className="text-muted-foreground text-sm mt-1">Welcome, {customer?.first_name}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <nav className="lg:w-52 shrink-0">
            <div className="hidden lg:flex flex-col gap-1 sticky top-24">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left ${
                      active ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
              <div className="border-t border-border mt-3 pt-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all w-full text-left"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            </div>

            {/* Mobile tabs */}
            <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                      active ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="border border-border/30 p-6 lg:p-8">
              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "address" && <AddressTab />}
              {activeTab === "orders" && <OrdersTab />}
              {activeTab === "password" && <PasswordTab />}
            </div>
          </div>
        </div>

        {/* Mobile logout */}
        <div className="lg:hidden mt-8">
          <Button variant="outline" onClick={handleLogout} className="gap-2 text-destructive hover:text-destructive w-full">
            <LogOut size={16} /> Uitloggen
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
