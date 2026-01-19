
import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, placeOrder, orders } = useAuth();
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canCancel, setCanCancel] = useState(true);
  const [currentOrderId, setCurrentOrderId] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: user?.address || '',
    street: user?.street || '',
    payment: 'cod',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => setCanCancel(false), 30000); // 30s cancel window
      return () => clearTimeout(timer);
    }
  }, [step]);

  const validate = () => {
    if (!/^[a-zA-Z\s]+$/.test(formData.name)) return "Name can only contain alphabets.";
    if (!/^\d{10,}$/.test(formData.phone)) return "Phone must be at least 10 digits.";
    if (formData.address.length < 5) return "Please enter a valid address.";
    
    if (formData.payment === 'card') {
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) return "Invalid card number (16 digits).";
      if (!/^\d{3}$/.test(formData.cvv)) return "Invalid CVV (3 digits).";
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      window.scrollTo(0, 0);
      return;
    }
    setError('');
    setLoading(true);
    
    const orderId = Math.random().toString(36).substr(2, 6).toUpperCase();
    
    setTimeout(() => {
      setLoading(false);
      setCurrentOrderId(orderId);
      placeOrder({
        id: orderId,
        userId: user?.id || 'guest',
        userName: formData.name,
        items: [...cart],
        total: totalPrice + 5,
        status: 'pending',
        timestamp: Date.now(),
        address: `${formData.address}, ${formData.street}`,
        phone: formData.phone
      });
      setStep('success');
      clearCart();
    }, 2000);
  };

  const orderStatus = orders.find(o => o.id === currentOrderId)?.status || 'pending';

  if (step === 'success') {
    return (
      <div className="pt-32 pb-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl text-center border border-neutral-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl animate-pulse">✓</div>
          <h2 className="text-3xl font-bebas tracking-wide mb-2">ORDER #{currentOrderId}</h2>
          <p className="text-neutral-500 mb-6">Chef is preparing your meal.</p>
          
          <div className="bg-slate-50 p-6 rounded-2xl mb-8 text-left space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-neutral-400">STATUS</span>
              <span className={`text-xs font-bold uppercase ${orderStatus === 'accepted' ? 'text-green-600' : 'text-yellow-600'}`}>
                {orderStatus === 'accepted' ? 'Being Cooked' : 'Waiting for kitchen...'}
              </span>
            </div>
            
            {orderStatus === 'accepted' && (
              <div className="pt-4 border-t border-dashed border-neutral-200">
                <p className="text-[10px] font-bold text-neutral-400 uppercase mb-2">Assigned Rider</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-xl">🛵</div>
                    <div>
                      <p className="text-sm font-bold">Rider: Ahmed Khan</p>
                      <p className="text-[10px] text-neutral-500">Contact: +1 888-000-111</p>
                    </div>
                  </div>
                  <a href="tel:+1888000111" className="bg-neutral-900 text-white p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.47 5.47L11 13.04a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <p className="text-[10px] font-bold text-neutral-400 uppercase mb-4 tracking-widest">Follow our kitchen for updates</p>
            <div className="flex justify-center space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors group">
                <img src="https://www.svgrepo.com/show/512120/facebook-176.svg" className="w-4 h-4 opacity-60 group-hover:opacity-100" alt="FB" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors group">
                <img src="https://www.svgrepo.com/show/521711/instagram.svg" className="w-4 h-4 opacity-60 group-hover:opacity-100" alt="IG" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors group">
                <img src="https://www.svgrepo.com/show/513008/twitter-154.svg" className="w-4 h-4 opacity-60 group-hover:opacity-100" alt="TW" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <Link to="/" className="block w-full yellow-bg text-neutral-900 font-bold px-10 py-4 rounded-xl hover:bg-neutral-900 hover:text-white transition-all">BACK TO HOME</Link>
            {canCancel && orderStatus === 'pending' && (
              <button onClick={() => setStep('details')} className="w-full border-2 border-red-100 text-red-500 font-bold px-10 py-4 rounded-xl hover:bg-red-50 transition-all text-sm">CANCEL ORDER</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-neutral-100">
              <h2 className="text-3xl font-bebas mb-8">DELIVERY & PAYMENT</h2>
              {error && <p className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-2">FULL NAME</label>
                    <input required name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="Only alphabets" className="w-full px-5 py-3 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-yellow-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-2">PHONE NUMBER</label>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="Numbers only" className="w-full px-5 py-3 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-yellow-400" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-2">ADDRESS</label>
                    <input required name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="Building/Appt No." className="w-full px-5 py-3 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-yellow-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-2">STREET / AREA</label>
                    <input required name="street" value={formData.street} onChange={handleInputChange} type="text" placeholder="Street Name" className="w-full px-5 py-3 rounded-2xl bg-slate-50 outline-none focus:ring-2 focus:ring-yellow-400" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <label className="block text-xs font-bold text-neutral-700 mb-4 uppercase tracking-wider">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button type="button" onClick={() => setFormData({...formData, payment: 'cod'})} className={`py-4 rounded-2xl border-2 font-bold transition-all ${formData.payment === 'cod' ? 'border-yellow-400 bg-yellow-50 text-neutral-900' : 'border-neutral-100 text-neutral-400 hover:border-yellow-200'}`}>💵 CASH</button>
                    <button type="button" onClick={() => setFormData({...formData, payment: 'card'})} className={`py-4 rounded-2xl border-2 font-bold transition-all ${formData.payment === 'card' ? 'border-yellow-400 bg-yellow-50 text-neutral-900' : 'border-neutral-100 text-neutral-400 hover:border-yellow-200'}`}>💳 CARD</button>
                  </div>

                  {formData.payment === 'card' && (
                    <div className="bg-slate-50 p-6 rounded-2xl space-y-4 animate-fadeIn">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-2">CARD NUMBER</label>
                        <input name="cardNumber" maxLength={16} value={formData.cardNumber} onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setFormData({...formData, cardNumber: val});
                        }} type="text" placeholder="1234 5678 1234 5678" className="w-full px-5 py-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-yellow-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input name="expiry" value={formData.expiry} onChange={handleInputChange} type="text" placeholder="MM/YY" className="w-full px-5 py-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-yellow-400" />
                        <input name="cvv" maxLength={3} value={formData.cvv} onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setFormData({...formData, cvv: val});
                        }} type="password" placeholder="CVV" className="w-full px-5 py-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-yellow-400" />
                      </div>
                    </div>
                  )}
                </div>

                <button disabled={loading} type="submit" className="w-full yellow-bg hover:bg-neutral-900 hover:text-white text-neutral-900 font-bold py-5 rounded-2xl transition-all shadow-lg text-lg">
                  {loading ? "VERIFYING..." : `PLACE ORDER ($${(totalPrice + 5).toFixed(2)})`}
                </button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 sticky top-24">
              <h2 className="text-3xl font-bebas mb-8">ORDER SUMMARY</h2>
              <div className="max-h-[300px] overflow-y-auto no-scrollbar mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center mb-4">
                    <div className="text-sm font-bold text-neutral-700">{item.name} <span className="text-neutral-400 ml-2">x{item.quantity}</span></div>
                    <span className="text-sm font-bold text-neutral-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-neutral-200 my-4 pt-4 space-y-2">
                 <div className="flex justify-between text-xs font-bold text-neutral-500"><span>SUBTOTAL</span><span>${totalPrice.toFixed(2)}</span></div>
                 <div className="flex justify-between text-xs font-bold text-neutral-500"><span>DELIVERY</span><span>$5.00</span></div>
              </div>
              <div className="flex justify-between text-2xl font-bebas tracking-wide mt-6 border-t pt-4"><span>TOTAL</span><span className="text-red-600">${(totalPrice + 5).toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
