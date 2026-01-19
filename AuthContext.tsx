
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { UserProfile, Order } from './types';

interface AuthContextType {
  user: UserProfile | null;
  login: (nameOrEmail: string, password?: string) => boolean;
  logout: () => void;
  isLoggedIn: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isManager: boolean;
  users: UserProfile[];
  orders: Order[];
  placeOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  applyDiscountToUser: (userId: string, discount: string) => void;
  upsertStaff: (staffData: Omit<UserProfile, 'orderHistory' | 'isAdmin'>) => void;
  deleteStaff: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_STAFF: UserProfile[] = [
  { id: 'super-id', name: 'Master Super', email: 'super', password: 'super', role: 'super-admin', isAdmin: true, orderHistory: [] },
  { id: 'admin-id', name: 'Store Admin', email: 'admin', password: 'admin', role: 'admin', isAdmin: true, orderHistory: [] },
  { id: 'manager-id', name: 'Day Manager', email: 'manager', password: 'manager', role: 'manager', isAdmin: false, orderHistory: [] }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('bh_users_db');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure the hardcoded super admin always exists or is updated
      if (!parsed.find((u: any) => u.role === 'super-admin')) {
        return [...parsed, ...INITIAL_STAFF.filter(s => s.role === 'super-admin')];
      }
      return parsed;
    }
    return INITIAL_STAFF;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bh_orders_db');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('bh_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('bh_users_db', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('bh_orders_db', JSON.stringify(orders));
  }, [orders]);

  const login = useCallback((nameOrEmail: string, password?: string) => {
    // Check in the "database"
    const match = users.find(u => 
      (u.email === nameOrEmail || u.name === nameOrEmail) && 
      (!password || u.password === password)
    );

    if (match) {
      setUser(match);
      localStorage.setItem('bh_current_user', JSON.stringify(match));
      return true;
    }

    // Auto-register regular users if not found (simulated)
    if (password && password.length >= 5) {
      const newUser: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        name: nameOrEmail.split('@')[0],
        email: nameOrEmail,
        password: password,
        role: 'user',
        isAdmin: false,
        orderHistory: []
      };
      setUsers(prev => [...prev, newUser]);
      setUser(newUser);
      localStorage.setItem('bh_current_user', JSON.stringify(newUser));
      return true;
    }

    return false;
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('bh_current_user');
  }, []);

  const placeOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
    setUsers(prev => prev.map(u => u.id === order.userId ? { ...u, orderHistory: [...u.orderHistory, order.id] } : u));
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  const applyDiscountToUser = useCallback((userId: string, discount: string) => {
    console.log(`Special offer ${discount} applied to user ${userId}`);
  }, []);

  const upsertStaff = useCallback((staffData: Omit<UserProfile, 'orderHistory' | 'isAdmin'>) => {
    setUsers(prev => {
      const existing = prev.find(u => u.id === staffData.id);
      if (existing) {
        return prev.map(u => u.id === staffData.id ? { ...u, ...staffData, isAdmin: staffData.role === 'admin' || staffData.role === 'super-admin' } : u);
      }
      return [...prev, { 
        ...staffData, 
        orderHistory: [], 
        isAdmin: staffData.role === 'admin' || staffData.role === 'super-admin' 
      }];
    });
  }, []);

  const deleteStaff = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, 
      isLoggedIn: !!user, 
      isSuperAdmin: user?.role === 'super-admin',
      isAdmin: user?.role === 'admin' || user?.role === 'super-admin',
      isManager: user?.role === 'manager',
      users, orders, placeOrder, updateOrderStatus, applyDiscountToUser,
      upsertStaff, deleteStaff
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
