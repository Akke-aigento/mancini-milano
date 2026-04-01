import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <AnnouncementBar />
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default Layout;
