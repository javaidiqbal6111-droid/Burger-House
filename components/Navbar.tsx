
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
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur shadow-sm z-50 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group" onClick={() => setIsOpen(false)}>
              <div className="w-11 h-11 yellow-bg rounded-xl flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                {settings.isLogoImage ? (
                  <img src={settings.logo} className="w-full h-full object-cover" alt="Logo" />
                ) : (
                  <span className="text-xl font-black">{settings.logo}</span>
                )}
              </div>
              <span className="text-2xl font-bebas tracking-[0.1em] text-neutral-900 uppercase">{settings.name}</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-yellow-600 transition-colors">Home</Link>
            <Link to="/menu" className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-yellow-600 transition-colors">Menu</Link>
            {showManagement && (
              <Link to="/admin" className="text-[11px] font-black uppercase tracking-[0.2em] text-red-600 hover:text-red-700">Management</Link>
            )}
            <Link to="/about" className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-yellow-600 transition-colors">Story</Link>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="hidden sm:flex items-center space-x-4 pr-4 border-r border-neutral-100">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Welcome</p>
                  <p className="text-[11px] font-bold text-neutral-900">{user?.name}</p>
                </div>
                <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors" title="Logout">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block text-[11px] font-black uppercase tracking-[0.2em] text-neutral-900 bg-slate-100 px-5 py-2.5 rounded-xl hover:bg-yellow-400 transition-all">Sign In</Link>
            )}
            
            <Link to="/checkout" className="relative p-2.5 text-neutral-900 hover:bg-slate-100 rounded-xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-black text-white bg-red-600 rounded-lg shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <button className="md:hidden p-2.5 text-neutral-900 hover:bg-slate-100 rounded-xl" onClick={() => setIsOpen(!isOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`md:hidden fixed inset-0 bg-white z-[60] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-12">
            <span className="text-2xl font-bebas tracking-wider uppercase">{settings.name}</span>
            <button onClick={() => setIsOpen(false)} className="p-3 bg-slate-100 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="space-y-6 flex-grow">
            {['Home', 'Menu', 'About', 'Contact'].map((item) => (
              <Link key={item} to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} onClick={() => setIsOpen(false)} className="block text-4xl font-bebas tracking-widest text-neutral-900 hover:text-yellow-600 transition-colors uppercase">{item}</Link>
            ))}
            {showManagement && <Link to="/admin" onClick={() => setIsOpen(false)} className="block text-4xl font-bebas tracking-widest text-red-600 uppercase">Management</Link>}
          </div>
          <div className="pt-8 border-t border-neutral-100">
            {isLoggedIn ? (
              <div className="space-y-4">
                <p className="font-bold text-neutral-400 text-sm uppercase">Active: {user?.name}</p>
                <button onClick={handleLogout} className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl uppercase tracking-widest">Sign Out</button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full bg-neutral-900 text-white font-bold py-4 rounded-2xl text-center uppercase tracking-widest">Sign In</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
