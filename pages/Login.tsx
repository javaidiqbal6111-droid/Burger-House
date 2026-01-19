
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.tsx';
import { useStore } from '../StoreContext.tsx';

export default function Login() {
  const [formData, setFormData] = useState({ nameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { settings } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(formData.nameOrEmail, formData.password);
    
    if (success) {
      const savedUser = localStorage.getItem('bh_current_user');
      const userObj = savedUser ? JSON.parse(savedUser) : null;
      
      if (userObj && userObj.role !== 'user') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError("Invalid login credentials. Please try again.");
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="yellow-bg py-10 text-center px-8">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
             {settings.isLogoImage ? (
               <img src={settings.logo} className="w-full h-full object-cover" />
             ) : (
               <span className="text-3xl">{settings.logo}</span>
             )}
           </div>
           <h2 className="text-4xl font-bebas tracking-wide text-neutral-900 leading-none mb-2">{settings.name} PORTAL</h2>
           <p className="text-[10px] text-neutral-800 font-bold uppercase tracking-widest">Super: super/super | Admin: admin/admin</p>
        </div>
        
        <form className="p-10 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-600 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-tighter">Login ID / Email</label>
            <input 
              required 
              type="text" 
              placeholder="Your credentials" 
              className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-yellow-400 outline-none transition-all"
              value={formData.nameOrEmail}
              onChange={(e) => setFormData({...formData, nameOrEmail: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-2 uppercase tracking-tighter">Secure Password</label>
            <input 
              required 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-5 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-yellow-400 outline-none transition-all"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-neutral-900 hover:bg-yellow-400 hover:text-neutral-900 text-white font-bold py-4 rounded-2xl transition-all shadow-lg text-lg">
            SIGN IN
          </button>
          <div className="pt-4 border-t text-center">
            <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest leading-relaxed">Protected by {settings.name} <br/> Security Shield</p>
          </div>
        </form>
      </div>
    </div>
  );
}
