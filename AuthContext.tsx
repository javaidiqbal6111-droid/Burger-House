
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
  upsertStaff: (staffData: Omit<UserProfile, 'orderHistory' | 'isAdmin'>) => void;
  deleteStaff: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_STAFF: UserProfile[] = [
  { id: 'super-1', name: 'Master Admin', email: 'super', password: 'super', role: 'super-admin', isAdmin: true, orderHistory: [] },
  { id: 'admin-1', name: 'Store Manager', email: 'admin', password: 'admin', role: 'admin', isAdmin: true, orderHistory: [] },
  { id: 'manager-1', name: 'Shift Lead', email: 'manager', password: 'manager', role: 'manager', isAdmin: false, orderHistory: [] }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('bh_users_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure default super admin always exists
      if (!parsed.some((u: UserProfile) => u.role === 'super-admin')) {
        return [...parsed, INITIAL_STAFF[0]];
      }
      return parsed;
    }
    return INITIAL_STAFF;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bh_orders_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('bh_current_user_v2');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('bh_users_v2', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('bh_orders_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('bh_current_user_v2', JSON.stringify(user));
    } else {
      localStorage.removeItem('bh_current_user_v2');
    }
  }, [user]);

  const login = useCallback((nameOrEmail: string, password?: string) => {
    const match = users.find(u => 
      (u.email === nameOrEmail || u.name === nameOrEmail) && 
      (!password || u.password === password)
    );

    if (match) {
      setUser(match);
      return true;
    }

    // Auto-registration for new customers (development simulation)
    if (password && password.length >= 4) {
      const newUser: UserProfile = {
        id: `u-${Math.random().toString(36).substr(2, 5)}`,
        name: nameOrEmail.split('@')[0],
        email: nameOrEmail.includes('@') ? nameOrEmail : `${nameOrEmail}@example.com`,
        password: password,
        role: 'user',
        isAdmin: false,
        orderHistory: []
      };
      setUsers(prev => [...prev, newUser]);
      setUser(newUser);
      return true;
    }

    return false;
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const placeOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
    setUsers(prev => prev.map(u => 
      u.id === order.userId ? { ...u, orderHistory: [...(u.orderHistory || []), order.id] } : u
    ));
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  const upsertStaff = useCallback((staffData: Omit<UserProfile, 'orderHistory' | 'isAdmin'>) => {
    setUsers(prev => {
      const existingIdx = prev.findIndex(u => u.id === staffData.id);
      const isPrivileged = staffData.role === 'admin' || staffData.role === 'super-admin';
      
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...staffData, isAdmin: isPrivileged };
        return updated;
      }
      return [...prev, { ...staffData, orderHistory: [], isAdmin: isPrivileged }];
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
      users, orders, placeOrder, updateOrderStatus,
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
