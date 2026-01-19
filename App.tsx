
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import CartNotification from './components/CartNotification';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import { MenuProvider } from './MenuContext';
import { StoreProvider } from './StoreContext';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AuthProvider>
        <MenuProvider>
          <CartProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin" element={<Admin />} />
                  </Routes>
                </main>
                <Footer />
                <CartNotification />
              </div>
            </Router>
          </CartProvider>
        </MenuProvider>
      </AuthProvider>
    </StoreProvider>
  );
};

export default App;
