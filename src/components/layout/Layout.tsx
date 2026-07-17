import SplashScreen from '@/components/SplashScreen';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '@/components/CartDrawer';
import BackToTop from '@/components/BackToTop';
import CookieConsent from '@/components/CookieConsent';

const Layout = ({ children }: { children: React.ReactNode }) => {


  return (
    <div className="min-h-screen flex flex-col animate-in fade-in duration-300">
      <SplashScreen />
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
