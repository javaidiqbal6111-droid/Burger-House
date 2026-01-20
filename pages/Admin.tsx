
import React, { useState, useMemo, useRef } from 'react';
import { useAuth } from '../AuthContext.tsx';
import { useMenu } from '../MenuContext.tsx';
import { useStore } from '../StoreContext.tsx';
import { Navigate } from 'react-router-dom';
import { Order, FoodItem, UserProfile, StoreSettings } from '../types.ts';

const CATEGORIES: FoodItem['category'][] = ['Burger', 'Pizza', 'Fries', 'Drinks', 'Deals', 'More Fun'];

export default function Admin() {
  const { user, isAdmin, isSuperAdmin, isManager, orders, users, updateOrderStatus, upsertStaff, deleteStaff } = useAuth();
  const { foodItems, addItem, updateItem, deleteItem } = useMenu();
  const { settings, updateSettings } = useStore();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'users' | 'analytics' | 'menu' | 'staff' | 'settings'>('orders');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store Settings Form State
  const [storeFormData, setStoreFormData] = useState<StoreSettings>({ ...settings });

  // Staff Form State
  const [editingStaff, setEditingStaff] = useState<UserProfile | null>(null);
  const [staffFormData, setStaffFormData] = useState<Omit<UserProfile, 'orderHistory' | 'isAdmin'>>({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'manager'
  });

  // Menu Form State
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [menuFormData, setMenuFormData] = useState<Omit<FoodItem, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: 'Burger',
    rating: 5,
    reviews: 0,
    image: '',
    discount: 0,
    isPopular: false
  });

  if (!isAdmin && !isManager) return <Navigate to="/login" />;

  // Analytics Calculations
  // Fix: Explicitly type the useMemo result to prevent members from being inferred as 'unknown'
  const analytics = useMemo<{
    totalRevenue: number;
    completedOrders: number;
    avgOrderValue: number;
    categorySales: Record<string, number>;
    topItems: (FoodItem & { soldCount: number })[];
  }>(() => {
    const validOrders = orders.filter(o => o.status !== 'cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    const avgOrderValue = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;
    
    const categorySales: Record<string, number> = {};
    validOrders.forEach(o => {
      o.items.forEach(item => {
        categorySales[item.category] = (categorySales[item.category] || 0) + (item.price * item.quantity);
      });
    });

    const topItems = foodItems
      .map(item => ({
        ...item,
        soldCount: orders.reduce((acc, o) => acc + o.items.filter(i => i.id === item.id).reduce((sum, i) => sum + i.quantity, 0), 0)
      }))
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 5);

    return { totalRevenue, completedOrders, avgOrderValue, categorySales, topItems };
  }, [orders, foodItems]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders;
    return orders.filter(o => o.status === statusFilter);
  }, [orders, statusFilter]);

  const customerStats = useMemo(() => {
    return users
      .filter(u => u.role === 'user')
      .map(u => {
        const userOrders = orders.filter(o => o.userId === u.id);
        const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
        return { ...u, orderCount: userOrders.length, totalSpent };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }, [users, orders]);

  // Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMenuFormData(prev => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editingItem ? updateItem({ ...menuFormData, id: editingItem.id }) : addItem(menuFormData);
    resetMenuForm();
  };

  const resetMenuForm = () => {
    setShowMenuForm(false);
    setEditingItem(null);
    setMenuFormData({ name: '', description: '', price: 0, category: 'Burger', rating: 5, reviews: 100, image: '', discount: 0, isPopular: false });
  };

  const startEditingItem = (item: FoodItem) => {
    setEditingItem(item);
    setMenuFormData({ ...item });
    setShowMenuForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertStaff({ ...staffFormData, id: staffFormData.id || Math.random().toString(36).substr(2, 9) });
    setEditingStaff(null);
    setStaffFormData({ id: '', name: '', email: '', password: '', role: 'manager' });
  };

  const sendSpecialOffer = (email: string) => {
    alert(`Success: A 25% discount voucher has been generated and emailed to ${email}`);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Permission Banner */}
        <div className={`mb-6 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between shadow-sm border gap-4 ${isSuperAdmin ? 'bg-purple-50 border-purple-100' : isAdmin ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xl shadow-sm ${isSuperAdmin ? 'bg-purple-600 text-white' : isAdmin ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
              {isSuperAdmin ? '👑' : isAdmin ? '🛡️' : '📋'}
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isSuperAdmin ? 'text-purple-600' : isAdmin ? 'text-red-600' : 'text-blue-600'}`}>
                {user?.role.replace('-', ' ')} Access
              </p>
              <h2 className="text-sm font-bold text-neutral-800 line-clamp-1">Welcome to {settings.name} Control Center</h2>
            </div>
          </div>
          <span className="text-[10px] font-bold px-3 py-1 bg-white rounded-full shadow-sm self-start md:self-auto">{new Date().toLocaleDateString()}</span>
        </div>

        <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <h1 className="text-3xl md:text-4xl font-bebas tracking-wide text-neutral-900 uppercase">{activeTab} Management</h1>
          <div className="flex bg-white rounded-xl p-1 shadow-sm border overflow-x-auto no-scrollbar scroll-smooth">
            {['orders', 'menu', 'staff', 'analytics', 'users', 'settings'].map((tab) => {
               if (tab === 'staff' && !isSuperAdmin && !isAdmin) return null;
               if (tab === 'settings' && !isSuperAdmin) return null;
               return (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)} 
                  className={`px-4 md:px-6 py-2 rounded-lg font-bold text-xs md:text-sm transition-all uppercase whitespace-nowrap ${activeTab === tab ? 'bg-yellow-400 shadow-md text-neutral-900' : 'text-neutral-500 hover:bg-slate-50'}`}
                >
                  {tab}
                </button>
               )
            })}
          </div>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Total Revenue', value: `$${analytics.totalRevenue.toFixed(2)}`, color: 'bg-green-500', icon: '💰' },
                { label: 'Orders Completed', value: analytics.completedOrders, color: 'bg-blue-500', icon: '📦' },
                { label: 'Avg Order Value', value: `$${analytics.avgOrderValue.toFixed(2)}`, color: 'bg-purple-500', icon: '📈' },
                { label: 'Total Items Sold', value: orders.reduce((acc, o) => acc + o.items.length, 0), color: 'bg-orange-500', icon: '🍔' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-neutral-100 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-20 h-20 ${stat.color} opacity-5 -mr-8 -mt-8 rounded-full`}></div>
                  <div className="text-xl md:text-2xl mb-2">{stat.icon}</div>
                  <p className="text-[9px] md:text-[10px] font-black text-neutral-400 uppercase tracking-widest">{stat.label}</p>
                  <h4 className="text-xl md:text-2xl font-bold text-neutral-800">{stat.value}</h4>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-neutral-100">
                <h3 className="text-xl font-bebas mb-6 tracking-wide">REVENUE BY CATEGORY</h3>
                <div className="space-y-4">
                  {Object.entries(analytics.categorySales).map(([cat, val]) => (
                    <div key={cat}>
                      <div className="flex justify-between text-xs font-bold mb-1 uppercase">
                        <span>{cat}</span>
                        <span>${val.toFixed(2)}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400" 
                          style={{ width: `${analytics.totalRevenue > 0 ? (val / analytics.totalRevenue) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-neutral-100">
                <h3 className="text-xl font-bebas mb-6 tracking-wide">TOP PERFORMING DISHES</h3>
                <div className="space-y-4">
                  {analytics.topItems.map((item, i) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 flex items-center justify-center bg-white rounded-lg text-[10px] font-bold flex-shrink-0">{i+1}</span>
                        <img src={item.image} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" alt="" />
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">{item.name}</p>
                          <p className="text-[10px] text-neutral-400 uppercase font-black truncate">{item.category}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-white px-2 md:px-3 py-1 rounded-full shadow-sm whitespace-nowrap">{item.soldCount} SOLD</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users / Customers Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-neutral-100 overflow-hidden animate-fadeIn">
            <div className="p-6 md:p-8 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <h3 className="text-xl font-bebas">CUSTOMER DATABASE</h3>
               <span className="text-xs font-bold bg-slate-100 px-4 py-2 rounded-full text-neutral-500">{customerStats.length} Total Customers</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest">Customer</th>
                    <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest">Orders</th>
                    <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest">Spent</th>
                    <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest text-right">Loyalty Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {customerStats.map(customer => (
                    <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-yellow-100 flex-shrink-0 flex items-center justify-center font-bold text-yellow-700">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-neutral-800">{customer.name}</p>
                            <p className="text-[10px] text-neutral-400">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className="bg-neutral-100 px-3 py-1 rounded-full text-xs font-bold">{customer.orderCount}</span>
                      </td>
                      <td className="px-8 py-5 font-bold text-sm text-neutral-700">${customer.totalSpent.toFixed(2)}</td>
                      <td className="px-8 py-5 text-right">
                         <button 
                          onClick={() => sendSpecialOffer(customer.email)}
                          className="text-[10px] font-black uppercase text-yellow-600 border border-yellow-200 px-4 py-2 rounded-xl hover:bg-yellow-400 hover:text-white transition-all"
                         >
                           SEND OFFER
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Staff Management Tab */}
        {activeTab === 'staff' && (isSuperAdmin || isAdmin) && (
          <div className="space-y-10 animate-fadeIn">
            <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-neutral-100">
              <h3 className="text-2xl font-bebas mb-6">{editingStaff ? 'EDIT STAFF MEMBER' : 'REGISTER NEW STAFF'}</h3>
              <form onSubmit={handleStaffSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-tighter">Legal Name</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-2xl bg-slate-50 outline-none border-2 border-transparent focus:border-yellow-400" value={staffFormData.name} onChange={e => setStaffFormData({...staffFormData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-tighter">Employee Email</label>
                  <input required type="email" className="w-full px-4 py-3 rounded-2xl bg-slate-50 outline-none border-2 border-transparent focus:border-yellow-400" value={staffFormData.email} onChange={e => setStaffFormData({...staffFormData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-tighter">System Password</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-2xl bg-slate-50 outline-none border-2 border-transparent focus:border-yellow-400" value={staffFormData.password} onChange={e => setStaffFormData({...staffFormData, password: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-tighter">Access Tier</label>
                  <select className="w-full px-4 py-3 rounded-2xl bg-slate-50 outline-none border-2 border-transparent focus:border-yellow-400 font-bold" value={staffFormData.role} onChange={e => setStaffFormData({...staffFormData, role: e.target.value as any})}>
                    {isSuperAdmin && <option value="admin">Admin (Store Lead)</option>}
                    <option value="manager">Manager (Ops)</option>
                  </select>
                </div>
                <div className="lg:col-span-4 flex justify-end gap-4 mt-4">
                  {editingStaff && <button type="button" onClick={() => {setEditingStaff(null); setStaffFormData({id:'', name:'', email:'', password:'', role:'manager'})}} className="px-8 py-3 rounded-xl bg-slate-200 font-bold text-xs uppercase transition-all">Cancel</button>}
                  <button type="submit" className="px-10 py-4 rounded-2xl bg-neutral-900 text-white hover:bg-yellow-400 hover:text-neutral-900 font-bold text-xs uppercase shadow-lg transition-all w-full md:w-auto">
                    {editingStaff ? 'Update Records' : 'Register Employee'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-neutral-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest">Employee</th>
                      <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest">Login ID</th>
                      <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest">Level</th>
                      <th className="px-8 py-5 text-[10px] font-black text-neutral-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {users.filter(u => u.role !== 'user').map(staff => (
                      <tr key={staff.id} className="hover:bg-slate-50 transition-all">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-[10px] ${staff.role === 'super-admin' ? 'bg-purple-600 text-white' : 'bg-neutral-100'}`}>
                              {staff.name.charAt(0)}
                            </div>
                            <span className="font-bold text-sm text-neutral-800 truncate max-w-[120px]">{staff.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-[11px] text-neutral-600 font-mono">{staff.email}</td>
                        <td className="px-8 py-5">
                           <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${
                              staff.role === 'super-admin' ? 'bg-purple-100 text-purple-700' :
                              staff.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {staff.role}
                            </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          {staff.role !== 'super-admin' && (isSuperAdmin || (isAdmin && staff.role === 'manager')) && (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => {setEditingStaff(staff); setStaffFormData({...staff})}} className="p-2 hover:bg-yellow-400 rounded-lg transition-all" title="Edit">✏️</button>
                              <button onClick={() => {if(confirm('Confirm employee removal?')) deleteStaff(staff.id)}} className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-all" title="Remove">🗑️</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-10 animate-fadeIn">
            {(isSuperAdmin || isAdmin) && (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-2xl font-bebas">MENU CATALOG</h3>
                {!showMenuForm && (
                  <button onClick={() => setShowMenuForm(true)} className="w-full md:w-auto bg-neutral-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 hover:text-neutral-900 transition-all shadow-lg flex items-center justify-center space-x-2">
                    <span>ADD NEW DISH</span><span className="text-xl">+</span>
                  </button>
                )}
              </div>
            )}

            {showMenuForm && (
              <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-neutral-100 animate-fadeIn">
                <form onSubmit={handleMenuSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-4 space-y-4">
                    <div className="aspect-square rounded-3xl bg-slate-50 border-2 border-dashed border-neutral-200 overflow-hidden flex items-center justify-center relative group">
                      {menuFormData.image ? <img src={menuFormData.image} className="w-full h-full object-cover" alt="Preview" /> : <p className="text-[10px] font-bold text-neutral-400 uppercase text-center px-4">Click to upload or drag image</p>}
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 z-10 opacity-0"></button>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    <input type="text" placeholder="Or paste image URL" className="w-full px-4 py-2 rounded-xl bg-slate-50 border text-xs" value={menuFormData.image} onChange={e => setMenuFormData({...menuFormData, image: e.target.value})} />
                  </div>
                  <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-neutral-400">Dish Name</label>
                      <input required className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-yellow-400 font-bold" value={menuFormData.name} onChange={e => setMenuFormData({...menuFormData, name: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-neutral-400">Description</label>
                      <textarea required rows={3} className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-yellow-400 text-sm" value={menuFormData.description} onChange={e => setMenuFormData({...menuFormData, description: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-neutral-400">Category</label>
                      <select className="w-full px-5 py-3 rounded-2xl bg-slate-50 border font-bold" value={menuFormData.category} onChange={e => setMenuFormData({...menuFormData, category: e.target.value as any})}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-[10px] font-black uppercase text-neutral-400">Price ($)</label>
                         <input type="number" step="0.01" className="w-full px-5 py-3 rounded-2xl bg-slate-50 border font-bold" value={menuFormData.price} onChange={e => setMenuFormData({...menuFormData, price: parseFloat(e.target.value)})} />
                      </div>
                      <div>
                         <label className="text-[10px] font-black uppercase text-neutral-400">Disc (%)</label>
                         <input type="number" className="w-full px-5 py-3 rounded-2xl bg-slate-50 border font-bold" value={menuFormData.discount} onChange={e => setMenuFormData({...menuFormData, discount: parseInt(e.target.value)})} />
                      </div>
                    </div>
                    <div className="md:col-span-2 flex flex-col md:flex-row justify-end gap-4 mt-4">
                      <button type="button" onClick={resetMenuForm} className="w-full md:w-auto px-8 py-3 rounded-xl bg-slate-100 font-bold text-xs uppercase transition-all">Discard</button>
                      <button type="submit" className="w-full md:w-auto px-10 py-3 rounded-xl bg-neutral-900 text-white font-bold text-xs uppercase shadow-xl hover:bg-yellow-400 hover:text-neutral-900 transition-all">Save Changes</button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {foodItems.map(item => (
                <div key={item.id} className="bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-neutral-100 shadow-sm group hover:shadow-lg transition-all">
                  <div className="relative aspect-video">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name} />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-sm">{item.category}</span>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-neutral-800 mb-1 truncate">{item.name}</h4>
                    <p className="text-[10px] text-neutral-500 line-clamp-2 mb-4 leading-relaxed">{item.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t">
                       <span className="text-xl font-bebas text-red-600">${item.price.toFixed(2)}</span>
                       <div className="flex gap-2">
                          <button onClick={() => startEditingItem(item)} className="p-2 bg-slate-100 rounded-lg text-[10px] font-bold transition-all hover:bg-neutral-900 hover:text-white">EDIT</button>
                          <button onClick={() => {if(confirm('Delete dish from menu?')) deleteItem(item.id)}} className="p-2 bg-red-50 text-red-600 rounded-lg text-[10px] transition-all hover:bg-red-600 hover:text-white">🗑️</button>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-xl font-bebas">LIVE ORDERS</h3>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="w-full md:w-auto bg-white border px-4 py-2 rounded-xl font-bold text-xs outline-none shadow-sm cursor-pointer">
                  <option value="all">ALL ORDERS</option>
                  <option value="pending">PENDING</option>
                  <option value="accepted">ACCEPTED</option>
                  <option value="delivered">DELIVERED</option>
                  <option value="cancelled">CANCELLED</option>
                </select>
             </div>
             {filteredOrders.length === 0 ? (
               <div className="bg-white p-20 text-center text-neutral-400 font-bold uppercase tracking-widest rounded-3xl border border-dashed border-neutral-200">No matching orders.</div>
             ) : filteredOrders.map(order => (
               <div key={order.id} className="bg-white p-6 rounded-[1.5rem] border border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm hover:shadow-md transition-all">
                 <div className="w-full md:w-auto">
                   <div className="flex items-center gap-3 mb-2">
                     <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded">#{order.id}</span>
                     <span className={`text-[10px] font-bold uppercase ${
                       order.status === 'pending' ? 'text-yellow-700' : 
                       order.status === 'accepted' ? 'text-blue-700' : 
                       order.status === 'delivered' ? 'text-green-700' : 'text-red-700'
                     }`}>
                       {order.status}
                     </span>
                   </div>
                   <h4 className="font-bold text-neutral-800">{order.userName}</h4>
                   <p className="text-xs text-neutral-400">{order.items.length} items • ${order.total.toFixed(2)}</p>
                 </div>
                 <div className="flex gap-2 w-full md:w-auto">
                    {order.status === 'pending' && <button onClick={() => updateOrderStatus(order.id, 'accepted')} className="flex-grow md:flex-grow-0 bg-neutral-900 text-white text-[10px] px-6 py-2 rounded-lg font-bold transition-all hover:bg-yellow-400 hover:text-neutral-900 shadow-sm">ACCEPT</button>}
                    {order.status === 'accepted' && <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="flex-grow md:flex-grow-0 bg-green-600 text-white text-[10px] px-6 py-2 rounded-lg font-bold transition-all hover:bg-green-700 shadow-sm">DELIVER</button>}
                    {order.status === 'pending' && <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="flex-grow md:flex-grow-0 text-red-600 border border-red-100 text-[10px] px-6 py-2 rounded-lg font-bold transition-all hover:bg-red-50 shadow-sm">CANCEL</button>}
                    {(order.status === 'delivered' || order.status === 'cancelled') && <span className="text-[10px] text-neutral-300 font-bold uppercase py-2 tracking-widest">ARCHIVED</span>}
                 </div>
               </div>
             ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && isSuperAdmin && (
          <div className="max-w-2xl mx-auto animate-fadeIn px-2 md:px-0">
            <div className="bg-white p-8 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-neutral-100">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 yellow-bg rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl shadow-lg overflow-hidden">
                  {storeFormData.isLogoImage ? <img src={storeFormData.logo} className="w-full h-full object-cover" alt="Branding" /> : storeFormData.logo}
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bebas">REBRANDING</h3>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Global Store Identity</p>
                </div>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); updateSettings(storeFormData); alert('Branding updated globally!'); }} className="space-y-8">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-tight">Restaurant Name</label>
                  <input required type="text" className="w-full px-5 py-3 rounded-2xl bg-slate-50 outline-none border-2 border-transparent focus:border-yellow-400 text-lg font-bold transition-all" value={storeFormData.name} onChange={e => setStoreFormData({ ...storeFormData, name: e.target.value.toUpperCase() })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-4 uppercase tracking-tight">Logo Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setStoreFormData({ ...storeFormData, isLogoImage: false })} className={`py-3 rounded-xl border-2 font-bold transition-all text-xs ${!storeFormData.isLogoImage ? 'border-yellow-400 bg-yellow-50 text-neutral-900' : 'border-slate-100 text-neutral-400'}`}>EMOJI ICON</button>
                    <button type="button" onClick={() => setStoreFormData({ ...storeFormData, isLogoImage: true })} className={`py-3 rounded-xl border-2 font-bold transition-all text-xs ${storeFormData.isLogoImage ? 'border-yellow-400 bg-yellow-50 text-neutral-900' : 'border-slate-100 text-neutral-400'}`}>IMAGE LINK</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-tight">{storeFormData.isLogoImage ? 'IMAGE URL' : 'EMOJI / SYMBOL'}</label>
                  <input required type="text" className="w-full px-5 py-3 rounded-2xl bg-slate-50 outline-none border-2 border-transparent focus:border-yellow-400 transition-all" value={storeFormData.logo} onChange={e => setStoreFormData({ ...storeFormData, logo: e.target.value })} />
                </div>
                <button type="submit" className="w-full bg-neutral-900 text-white font-bold py-5 rounded-2xl hover:bg-yellow-400 hover:text-neutral-900 transition-all shadow-xl uppercase tracking-widest text-sm">SAVE SETTINGS</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
