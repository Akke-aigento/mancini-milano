import { useLocation } from 'react-router-dom';
import SplashScreen from '@/components/SplashScreen';
import AnnouncementBar from './AnnouncementBar';
import LookbookBanner from './LookbookBanner';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '@/components/CartDrawer';
import BackToTop from '@/components/BackToTop';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

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
    </div>
  );
};

export default Layout;
