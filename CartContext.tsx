
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { FoodItem, CartItem } from './types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  lastAddedItem: FoodItem | null;
  clearNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bh_cart_cache');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [lastAddedItem, setLastAddedItem] = useState<FoodItem | null>(null);

  useEffect(() => {
    localStorage.setItem('bh_cart_cache', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item: FoodItem) => {
    setLastAddedItem(item);
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const clearNotification = useCallback(() => setLastAddedItem(null), []);

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totalItems = useMemo(() => cart.reduce((acc, i) => acc + i.quantity, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((acc, i) => {
    const price = i.discount ? i.price * (1 - i.discount / 100) : i.price;
    return acc + (price * i.quantity);
  }, 0), [cart]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      totalItems, 
      totalPrice, 
      lastAddedItem, 
      clearNotification 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
