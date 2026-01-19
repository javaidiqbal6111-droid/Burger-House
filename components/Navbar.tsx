
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext.tsx';
import { useAuth } from '../AuthContext.tsx';
import { useStore } from '../StoreContext.tsx';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { isLoggedIn, user, logout, isAdmin, isManager } = useAuth();
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const showManagement = isAdmin || isManager;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 yellow-bg rounded-lg flex items-center justify-center overflow-hidden">
                {settings.isLogoImage ? (
                  <img src={settings.logo} className="w-full h-full object-cover" alt="Logo" />
                ) : (
                  <span className="text-xl font-bold">{settings.logo}</span>
                )}
              </div>
              <span className="text-2xl font-bebas tracking-wider text-neutral-800">{settings.name}</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-neutral-700 hover:text-yellow-600 font-medium transition-colors">Home</Link>
            <Link to="/menu" className="text-neutral-700 hover:text-yellow-600 font-medium transition-colors">Menu</Link>
            {showManagement && (
              <Link to="/admin" className="text-yellow-600 font-bold hover:text-yellow-700 transition-colors">
                {isAdmin ? 'Admin Panel' : 'Management'}
              </Link>
            )}
            <Link to="/about" className="text-neutral-700 hover:text-yellow-600 font-medium transition-colors">About</Link>
            <Link to="/contact" className="text-neutral-700 hover:text-yellow-600 font-medium transition-colors">Contact</Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="hidden sm:flex items-center space-x-4">
                <span className="text-xs font-bold text-neutral-500 bg-slate-100 px-3 py-1 rounded-full">{user?.name}</span>
                <button onClick={handleLogout} className="text-red-600 text-xs font-bold hover:underline">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block text-neutral-700 hover:text-yellow-600 font-medium">Login</Link>
            )}
            
            <Link to="/checkout" className="relative p-2 text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 p-4 space-y-4 shadow-lg">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-lg font-medium">Home</Link>
          <Link to="/menu" onClick={() => setIsOpen(false)} className="block text-lg font-medium">Menu</Link>
          {showManagement && (
            <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-lg font-bold text-yellow-600">
              {isAdmin ? 'Admin Panel' : 'Management'}
            </Link>
          )}
          <Link to="/about" onClick={() => setIsOpen(false)} className="block text-lg font-medium">About</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="block text-lg font-medium">Contact</Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="block w-full text-left text-lg font-medium text-red-600">Logout ({user?.name})</button>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="block text-lg font-medium">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
