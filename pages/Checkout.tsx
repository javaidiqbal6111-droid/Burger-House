
import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, placeOrder, orders } = useAuth();
  const navigate = useNavigate();
  
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
    if (cart.length === 0 && step === 'details') {
      navigate('/menu');
    }
  }, [cart, step, navigate]);

  useEffect(() => {
    if (step === 'success') {
      const timer = setTimeout(() => setCanCancel(false), 30000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const validate = () => {
    if (formData.name.trim().length < 3) return "Please enter your full name.";
    if (!/^\d{10,}$/.test(formData.phone)) return "Enter a valid 10-digit phone number.";
    if (formData.address.length < 5) return "Please enter a valid delivery address.";
    
    if (formData.payment === 'card') {
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) return "Invalid card number.";
      if (!/^\d{3}$/.test(formData.cvv)) return "Invalid CVV.";
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setError('');
    setLoading(true);
    
    const orderId = `BH-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    // Simulate API delay
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
    }, 1800);
  };

  const activeOrder = orders.find(o => o.id === currentOrderId);

  if (step === 'success') {
    return (
      <div className="pt-32 pb-16 min-h-screen flex items-center justify-center px-4 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-center border border-neutral-100 animate-fadeIn">
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-inner">✓</div>
          <h2 className="text-4xl font-bebas tracking-wider mb-2 text-neutral-900">ORDER RECEIVED!</h2>
          <p className="text-neutral-500 mb-8 font-medium">Order ID: <span className="text-neutral-900 font-bold">{currentOrderId}</span></p>
          
          <div className="bg-slate-50 p-6 rounded-3xl mb-10 text-left border border-neutral-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">LIVE STATUS</span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                activeOrder?.status === 'accepted' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                {activeOrder?.status === 'accepted' ? 'Preparing' : 'Pending Confirmation'}
              </span>
            </div>
            
            <p className="text-xs text-neutral-600 leading-relaxed mb-4">
              Our chef has received your request and is starting to prepare your delicious meal. We'll notify you once it's out for delivery!
            </p>

            {activeOrder?.status === 'accepted' && (
              <div className="pt-4 border-t border-dashed border-neutral-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-2xl shadow-sm">🛵</div>
                  <div>
                    <p className="text-sm font-bold text-neutral-800">Assigned: Rider Ahmed</p>
                    <p className="text-[10px] text-neutral-400 uppercase font-black">Estimate: 25-35 mins</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Link to="/" className="block w-full bg-neutral-900 text-white font-bold py-5 rounded-2xl hover:bg-yellow-400 hover:text-neutral-900 transition-all shadow-xl uppercase tracking-widest text-sm">Return Home</Link>
            {canCancel && activeOrder?.status === 'pending' && (
              <button onClick={() => setStep('details')} className="w-full text-red-500 font-bold text-xs uppercase tracking-widest hover:underline py-2">Cancel Order</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-grow lg:w-2/3">
            <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-neutral-100">
              <h2 className="text-4xl font-bebas mb-10 tracking-wide text-neutral-900">CHECKOUT DETAILS</h2>
              
              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-3 animate-fadeIn">
                   <span className="text-lg">⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-widest">Your Name</label>
                    <input required name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="John Doe" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-yellow-400 outline-none font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-widest">Phone Number</label>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="03XXXXXXXXX" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-yellow-400 outline-none font-bold" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-widest">Shipping Address</label>
                    <input required name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="House/Flat No, Apartment Name" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-yellow-400 outline-none font-bold" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-widest">Landmark / Street</label>
                    <input required name="street" value={formData.street} onChange={handleInputChange} type="text" placeholder="Near XYZ Mall, ABC Street" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-yellow-400 outline-none font-bold" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <label className="block text-[10px] font-black text-neutral-400 mb-4 uppercase tracking-widest">Select Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setFormData({...formData, payment: 'cod'})} className={`py-5 rounded-2xl border-2 font-black transition-all text-xs tracking-widest ${formData.payment === 'cod' ? 'border-yellow-400 bg-yellow-50 text-neutral-900 shadow-md' : 'border-neutral-100 text-neutral-400'}`}>CASH ON DELIVERY</button>
                    <button type="button" onClick={() => setFormData({...formData, payment: 'card'})} className={`py-5 rounded-2xl border-2 font-black transition-all text-xs tracking-widest ${formData.payment === 'card' ? 'border-yellow-400 bg-yellow-50 text-neutral-900 shadow-md' : 'border-neutral-100 text-neutral-400'}`}>DEBIT / CREDIT CARD</button>
                  </div>

                  {formData.payment === 'card' && (
                    <div className="mt-6 bg-slate-50 p-6 md:p-8 rounded-[2rem] space-y-4 border border-neutral-100 animate-fadeIn">
                      <div>
                        <label className="block text-[10px] font-black text-neutral-400 mb-2 uppercase tracking-widest">Card Number</label>
                        <input name="cardNumber" maxLength={16} value={formData.cardNumber} onChange={(e) => setFormData({...formData, cardNumber: e.target.value.replace(/\D/g, '')})} type="text" placeholder="0000 0000 0000 0000" className="w-full px-6 py-4 rounded-xl bg-white border outline-none font-mono font-bold" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input name="expiry" value={formData.expiry} onChange={handleInputChange} type="text" placeholder="MM/YY" className="w-full px-6 py-4 rounded-xl bg-white border outline-none font-bold" />
                        <input name="cvv" maxLength={3} value={formData.cvv} onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})} type="password" placeholder="CVV" className="w-full px-6 py-4 rounded-xl bg-white border outline-none font-bold" />
                      </div>
                    </div>
                  )}
                </div>

                <button disabled={loading} type="submit" className="w-full bg-neutral-900 hover:bg-yellow-400 hover:text-neutral-900 text-white font-black py-6 rounded-[2rem] transition-all shadow-2xl text-lg uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      PROCESSING...
                    </span>
                  ) : `PLACE YOUR ORDER • $${(totalPrice + 5).toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-neutral-100 sticky top-24">
              <h2 className="text-2xl font-bebas mb-8 tracking-wide text-neutral-900">YOUR CART</h2>
              <div className="max-h-[350px] overflow-y-auto no-scrollbar mb-8 pr-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center mb-5 group">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                          <img src={item.image} className="w-full h-full object-cover" alt="" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-neutral-800 line-clamp-1">{item.name}</p>
                          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                       </div>
                    </div>
                    <span className="text-sm font-bold text-neutral-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-neutral-200 py-6 space-y-3">
                 <div className="flex justify-between text-xs font-bold text-neutral-400 uppercase tracking-widest"><span>SUBTOTAL</span><span>${totalPrice.toFixed(2)}</span></div>
                 <div className="flex justify-between text-xs font-bold text-neutral-400 uppercase tracking-widest"><span>DELIVERY FEE</span><span>$5.00</span></div>
              </div>
              <div className="flex justify-between text-3xl font-bebas tracking-widest mt-2 border-t pt-6 text-neutral-900">
                <span>TOTAL</span>
                <span className="text-red-600">${(totalPrice + 5).toFixed(2)}</span>
              </div>
              
              <p className="mt-8 text-[9px] text-neutral-400 font-bold uppercase tracking-widest text-center leading-relaxed">
                By placing this order you agree to our <br/> Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
