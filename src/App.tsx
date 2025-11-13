import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { HomePage } from './pages/Home';
import { AboutPage } from './pages/About';
import { MenuPage } from './pages/Menu';
import { ReservationsPage } from './pages/Reservations';
import { ContactPage } from './pages/Contact';
import { AdminPage } from './pages/Admin';

const App = () => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-night text-white">
      <div className="pointer-events-none fixed inset-0 bg-grid-overlay [background-size:48px_48px] opacity-20" />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      <ScrollToTop />
      <Navbar />
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default App;
