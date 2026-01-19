
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import Menu from './pages/Menu.tsx';
import Login from './pages/Login.tsx';
import Checkout from './pages/Checkout.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import Admin from './pages/Admin.tsx';
import CartNotification from './components/CartNotification.tsx';
import { CartProvider } from './CartContext.tsx';
import { AuthProvider } from './AuthContext.tsx';
import { MenuProvider } from './MenuContext.tsx';
import { StoreProvider } from './StoreContext.tsx';

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
