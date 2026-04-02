import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '@/components/CartDrawer';
import BackToTop from '@/components/BackToTop';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col animate-in fade-in duration-300">
    <AnnouncementBar />
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <CartDrawer />
    <BackToTop />
  </div>
);

export default Layout;
