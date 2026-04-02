import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCustomerAuth } from "@/integrations/sellqo/CustomerAuthContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, ArrowRight, Check, X } from "lucide-react";
import SEO from "@/components/SEO";

const PasswordStrength = ({ password }: { password: string }) => {
  const checks = [
    { label: "Min. 8 characters", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className="flex gap-3 mt-1.5">
      {checks.map((c) => (
        <span key={c.label} className={`flex items-center gap-1 text-xs ${c.pass ? "text-emerald-400" : "text-muted-foreground"}`}>
          {c.pass ? <Check size={12} /> : <X size={12} />} {c.label}
        </span>
      ))}
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, register } = useCustomerAuth();

  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const from = (location.state as { from?: string })?.from || "/account";

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Signed in successfully");
    } catch (err: any) {
      toast.error(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !regEmail || !regPassword) {
      toast.error("Please fill in all fields"); return;
    }
    if (regPassword !== regConfirm) {
      toast.error("Passwords do not match"); return;
    }
    if (regPassword.length < 8) {
      toast.error("Password must be at least 8 characters"); return;
    }
    setLoading(true);
    try {
      await register({ email: regEmail, password: regPassword, first_name: firstName, last_name: lastName });
      toast.success("Account created successfully");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "bg-secondary/50 border-border/50 h-12 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:border-ring/40 transition-all duration-200";

  return (
    <Layout>
      <SEO title="Account — Mancini Milano" description="Sign in or register at Mancini Milano." />
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <h1 className="font-heading text-3xl tracking-logo uppercase text-foreground text-center mb-8">
            Account
          </h1>

          {/* Tab switcher */}
          <div className="flex mb-8 border-b border-border/30 justify-center">
            <button
              onClick={() => setTab("login")}
              className={`pb-3 px-4 text-sm font-medium uppercase tracking-button transition-all duration-300 border-b-2 ${
                tab === "login"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab("register")}
              className={`pb-3 px-4 text-sm font-medium uppercase tracking-button transition-all duration-300 border-b-2 ${
                tab === "register"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in-0 duration-300">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={inputClasses}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-12 text-sm font-semibold gap-2 group bg-foreground text-background hover:bg-foreground/90" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={16} /> : null}
                Sign In
                {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>
          )}

          {/* Register Form */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-5 animate-in fade-in-0 duration-300">
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
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                <Input
                  type="email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="you@email.com"
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
                <Input
                  type="password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className={inputClasses}
                />
                <PasswordStrength password={regPassword} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Confirm Password</Label>
                <Input
                  type="password"
                  value={regConfirm}
                  onChange={e => setRegConfirm(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <Button type="submit" className="w-full h-12 text-sm font-semibold gap-2 group bg-foreground text-background hover:bg-foreground/90" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={16} /> : null}
                Register
                {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Login;
