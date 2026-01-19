
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StoreSettings } from './types.ts';

interface StoreContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: StoreSettings) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const DEFAULT_SETTINGS: StoreSettings = {
  name: 'BURGER HOUSE',
  logo: '🍔',
  isLogoImage: false
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('bh_store_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('bh_store_settings', JSON.stringify(settings));
    document.title = `${settings.name} | Premium Taste`;
  }, [settings]);

  const updateSettings = useCallback((newSettings: StoreSettings) => {
    setSettings(newSettings);
  }, []);

  return (
    <StoreContext.Provider value={{ settings, updateSettings }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
