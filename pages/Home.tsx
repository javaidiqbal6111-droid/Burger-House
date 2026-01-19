
import React, { useState, useMemo } from 'react';
import Hero from '../components/Hero';
import FoodCard from '../components/FoodCard';
import { useMenu } from '../MenuContext';
import { useStore } from '../StoreContext.tsx';
import { Link, useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { foodItems } = useMenu();
  const { settings } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const popularItems = useMemo(() => foodItems.filter(item => item.isPopular).slice(0, 4), [foodItems]);
  const navigate = useNavigate();
  
  const filteredSuggestions = useMemo(() => {
    if (!searchTerm) return [];
    return foodItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 3);
  }, [searchTerm, foodItems]);

  const handleCategoryClick = (category: string) => {
    navigate(`/menu?category=${category}`);
  };

  return (
    <div className="pb-16 bg-slate-50">
      <Hero />

      {/* Search Section */}
      <section className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder={`Find food at ${settings.name}...`} 
              className="w-full pl-12 pr-4 py-4 rounded-xl md:rounded-2xl border-2 border-neutral-100 focus:border-yellow-400 outline-none transition-all text-base md:text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-neutral-100 overflow-hidden z-50">
                {filteredSuggestions.length > 0 ? (
                  <div>
                    <p className="px-4 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider bg-slate-50">Search Results</p>
                    {filteredSuggestions.map(item => (
                      <Link key={item.id} to="/menu" className="flex items-center p-3 hover:bg-slate-50 transition-colors border-b last:border-0">
                        <img src={item.image} className="w-10 h-10 object-cover rounded flex-shrink-0 mr-3" alt="" />
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-neutral-800 truncate">{item.name}</p>
                          <p className="text-xs text-neutral-500">${item.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="px-4 py-3 text-sm text-neutral-500">No results found for "{searchTerm}"</p>
                )}
              </div>
            )}
          </div>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-bold px-8 py-4 rounded-xl md:rounded-2xl transition-all w-full md:w-auto whitespace-nowrap">
            SEARCH
          </button>
        </div>
      </section>

      {/* Quick Access Categories */}
      <section className="max-w-7xl mx-auto px-4 mt-16 md:mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <button onClick={() => handleCategoryClick('All')} className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-neutral-100 flex flex-col items-center text-center hover:shadow-lg transition-all cursor-pointer group">
             <div className="w-16 h-16 md:w-20 md:h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl md:text-4xl">🔥</span>
             </div>
             <h3 className="font-bebas text-xl md:text-2xl tracking-wide">MOST POPULAR</h3>
          </button>
          <button onClick={() => handleCategoryClick('Pizza')} className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-neutral-100 flex flex-col items-center text-center hover:shadow-lg transition-all cursor-pointer group">
             <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl md:text-4xl">🍕</span>
             </div>
             <h3 className="font-bebas text-xl md:text-2xl tracking-wide">FRESH & CHILLI</h3>
          </button>
          <button onClick={() => handleCategoryClick('More Fun')} className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-neutral-100 flex flex-col items-center text-center hover:shadow-lg transition-all cursor-pointer group">
             <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl md:text-4xl">✨</span>
             </div>
             <h3 className="font-bebas text-xl md:text-2xl tracking-wide">MORE FUN</h3>
          </button>
          <button onClick={() => handleCategoryClick('Drinks')} className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-neutral-100 flex flex-col items-center text-center hover:shadow-lg transition-all cursor-pointer group">
             <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl md:text-4xl">🥤</span>
             </div>
             <h3 className="font-bebas text-xl md:text-2xl tracking-wide">REFRESHING</h3>
          </button>
        </div>
      </section>

      {/* Featured Items */}
      <section className="max-w-7xl mx-auto px-4 mt-20 md:mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <span className="text-red-600 font-bold uppercase tracking-widest text-xs md:text-sm">ALWAYS TASTY</span>
            <h2 className="text-4xl md:text-5xl font-bebas tracking-tight">CHOOSE & ENJOY</h2>
          </div>
          <Link to="/menu" className="yellow-bg text-neutral-900 font-bold px-6 py-3 rounded-xl hover:bg-neutral-900 hover:text-white transition-all text-sm md:text-base">
            SEE FULL MENU
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {popularItems.map(item => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 mt-20 md:mt-24">
        <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-neutral-900 h-[350px] md:h-[400px] flex items-center px-8 md:px-12">
          <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden hidden lg:block">
             <img src="https://images.unsplash.com/photo-1547584370-2cc98b8b8dc8?q=80&w=800&fit=crop" className="w-full h-full object-cover opacity-60" alt="Promo" />
          </div>
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-white text-4xl md:text-6xl lg:text-7xl font-bebas leading-[0.9] mb-4">
              TRY THE BEST <br /> <span className="text-yellow-400">SIGNATURE</span> DEALS
            </h2>
            <p className="text-neutral-400 mb-8 text-base md:text-lg leading-relaxed">
              Get 30% off on all large orders today at {settings.name}. Premium ingredients at a special price.
            </p>
            <Link to="/menu?filter=discount" className="bg-yellow-400 text-neutral-900 font-bold px-8 md:px-10 py-3 md:py-4 rounded-xl hover:bg-white transition-all text-base md:text-lg inline-block">
              GET IT NOW
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
