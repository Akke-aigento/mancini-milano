import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Outlet, Navigate, useParams, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SellQoCartProvider } from "@/integrations/sellqo/CartContext";
import { CustomerAuthProvider } from "@/integrations/sellqo/CustomerAuthContext";
import { WorldProvider } from "@/contexts/WorldContext";
import ScrollToTop from "@/components/ScrollToTop";
import Splash from "./pages/Splash";
import Index from "./pages/Index";
import Collection from "./pages/Collection";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Cart from "./pages/Cart";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import SizeGuide from "./pages/SizeGuide";
import { CheckoutProvider } from "@/integrations/sellqo/CheckoutContext";
import Checkout from "./pages/Checkout";
import CheckoutAddress from "./pages/CheckoutAddress";
import CheckoutPayment from "./pages/CheckoutPayment";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Bedankt from "./pages/Bedankt";
import Login from "./pages/Login";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// SPA-level redirect (preserves query/hash). Lovable hosting does not support
// configured server 301s; this is the best-effort equivalent — search engines
// will follow the client-side redirect and pick up the new canonical.
const RedirectCollection = () => {
  const { slug } = useParams();
  const { search, hash } = useLocation();
  return <Navigate to={`/streetwear/collections/${slug}${search}${hash}`} replace />;
};

const RedirectProduct = () => {
  const { slug } = useParams();
  const { search, hash } = useLocation();
  return <Navigate to={`/streetwear/products/${slug}${search}${hash}`} replace />;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CustomerAuthProvider>
          <SellQoCartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <WorldProvider>
                <ScrollToTop />
                <Routes>
                  {/* Splash */}
                  <Route path="/" element={<Splash />} />

                  {/* Streetwear world */}
                  <Route path="/streetwear" element={<Index />} />
                  <Route path="/streetwear/collections/:slug" element={<Collection />} />
                  <Route path="/streetwear/products/:slug" element={<ProductDetail />} />

                  {/* 301-equivalent redirects from legacy paths */}
                  <Route path="/collections/:slug" element={<RedirectCollection />} />
                  <Route path="/products/:slug" element={<RedirectProduct />} />

                  {/* World-agnostic pages (stay at root) */}
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/size-guide" element={<SizeGuide />} />
                  <Route element={<CheckoutProvider><Outlet /></CheckoutProvider>}>
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/checkout/address" element={<CheckoutAddress />} />
                    <Route path="/checkout/payment" element={<CheckoutPayment />} />
                  </Route>
                  <Route path="/checkout/success" element={<CheckoutSuccess />} />
                  <Route path="/bedankt" element={<Bedankt />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </WorldProvider>
            </BrowserRouter>
          </SellQoCartProvider>
        </CustomerAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
