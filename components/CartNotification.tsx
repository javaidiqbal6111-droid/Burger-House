
import React, { useEffect, useState } from 'react';
import { useCart } from '../CartContext';
import { Link } from 'react-router-dom';

const CartNotification: React.FC = () => {
  const { lastAddedItem, clearNotification } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (lastAddedItem) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(clearNotification, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastAddedItem, clearNotification]);

  if (!lastAddedItem && !visible) return null;

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90 pointer-events-none'}`}>
      <div className="bg-neutral-900 text-white p-3 pr-4 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex items-center space-x-5 border border-white/5 min-w-[350px]">
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl overflow-hidden shadow-inner bg-white/5">
          <img src={lastAddedItem?.image} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            <p className="text-[10px] text-white/60 font-bold uppercase tracking-[0.2em]">ITEM ADDED</p>
          </div>
          <p className="text-sm font-bold truncate max-w-[160px]">{lastAddedItem?.name}</p>
        </div>
        <Link 
          to="/checkout" 
          onClick={() => setVisible(false)}
          className="bg-yellow-400 text-neutral-900 px-5 py-3 rounded-2xl font-bold text-xs hover:bg-white transition-all shadow-lg active:scale-95"
        >
          GO TO ORDER
        </Link>
        <button onClick={() => setVisible(false)} className="text-white/30 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartNotification;
