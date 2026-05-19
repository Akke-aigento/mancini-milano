import { useLocation } from 'react-router-dom';
import SplashScreen from '@/components/SplashScreen';
import AnnouncementBar from './AnnouncementBar';
import LookbookBanner from './LookbookBanner';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '@/components/CartDrawer';
import BackToTop from '@/components/BackToTop';
import CookieConsent from '@/components/CookieConsent';
import WorldSwitch from '@/components/WorldSwitch';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isHome = location.pathname === '/streetwear';

  return (
    <div className="min-h-screen flex flex-col animate-in fade-in duration-300 overflow-x-hidden">
      <SplashScreen />
      <WorldSwitch />
      <AnnouncementBar />
      {isHome && <LookbookBanner />}
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <BackToTop />
      <CookieConsent />
    </div>
  );
};

export default Layout;
