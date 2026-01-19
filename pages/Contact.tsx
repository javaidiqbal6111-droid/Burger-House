
import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      setError("Name must contain only alphabets.");
      return;
    }
    setError('');
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bebas tracking-wide mb-4">GET IN TOUCH</h1>
          <p className="text-neutral-500">We'd love to hear from you. Send us a message!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100">
               <p className="text-xs font-bold text-yellow-600 mb-2 uppercase">Visit Us</p>
               <p className="text-sm font-bold text-neutral-800">123 Burger St, NY</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100">
               <p className="text-xs font-bold text-yellow-600 mb-2 uppercase">Call Us</p>
               <p className="text-sm font-bold text-neutral-800">+1 234 567 890</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100">
               <p className="text-xs font-bold text-yellow-600 mb-2 uppercase">Email Us</p>
               <p className="text-sm font-bold text-neutral-800">hello@burgerhouse.com</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl">
              {status === 'success' ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">✨</div>
                  <h3 className="text-2xl font-bold mb-2 text-neutral-800">MESSAGE SENT!</h3>
                  <p className="text-neutral-500">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setStatus('idle')} className="mt-6 text-yellow-600 font-bold underline">Send another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <p className="text-red-600 text-xs font-bold bg-red-50 p-3 rounded-xl">{error}</p>}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-2">NAME</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Your Name" 
                      className="w-full px-5 py-3 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-2">EMAIL</label>
                    <input 
                      required 
                      type="email" 
                      placeholder="hello@example.com" 
                      className="w-full px-5 py-3 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-2">MESSAGE</label>
                    <textarea 
                      required 
                      rows={4} 
                      placeholder="How can we help?" 
                      className="w-full px-5 py-3 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <button disabled={status === 'loading'} className="w-full yellow-bg text-neutral-900 font-bold py-4 rounded-2xl hover:bg-neutral-900 hover:text-white transition-all shadow-lg">
                    {status === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
