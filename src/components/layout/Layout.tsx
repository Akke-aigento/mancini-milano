import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '@/components/CartDrawer';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <AnnouncementBar />
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <CartDrawer />
  </div>
);

export default Layout;
