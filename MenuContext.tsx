
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { FoodItem } from './types';
import { FOOD_ITEMS as INITIAL_ITEMS } from './data';

interface MenuContextType {
  foodItems: FoodItem[];
  addItem: (item: Omit<FoodItem, 'id'>) => void;
  updateItem: (item: FoodItem) => void;
  deleteItem: (id: number) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('bh_menu_db');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem('bh_menu_db', JSON.stringify(foodItems));
  }, [foodItems]);

  const addItem = useCallback((item: Omit<FoodItem, 'id'>) => {
    setFoodItems(prev => [
      ...prev,
      { ...item, id: prev.length > 0 ? Math.max(...prev.map(i => i.id)) + 1 : 1 }
    ]);
  }, []);

  const updateItem = useCallback((updatedItem: FoodItem) => {
    setFoodItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  }, []);

  const deleteItem = useCallback((id: number) => {
    setFoodItems(prev => prev.filter(item => item.id !== id));
  }, []);

  return (
    <MenuContext.Provider value={{ foodItems, addItem, updateItem, deleteItem }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within a MenuProvider');
  return context;
};
