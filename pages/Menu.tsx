
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMenu } from '../MenuContext';
import FoodCard from '../components/FoodCard';
import { FilterState } from '../types';

const CATEGORIES = ['All', 'Burger', 'Pizza', 'Fries', 'Drinks', 'Deals', 'More Fun'];

const Menu: React.FC = () => {
  const { foodItems } = useMenu();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';
  const showOnlyDiscount = queryParams.get('filter') === 'discount';

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    sort: 'none',
    onlyDiscounted: showOnlyDiscount,
    minRating: 0
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const category = queryParams.get('category') || 'All';
    const discount = queryParams.get('filter') === 'discount';
    setFilters(prev => ({ ...prev, category, onlyDiscounted: discount }));
  }, [location.search]);

  const filteredItems = useMemo(() => {
    let items = [...foodItems];
    if (searchTerm) items = items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filters.category !== 'All') items = items.filter(item => item.category === filters.category);
    if (filters.onlyDiscounted) items = items.filter(item => item.discount && item.discount > 0);
    if (filters.minRating > 0) items = items.filter(item => item.rating >= filters.minRating);
    
    if (filters.sort === 'low-high') items.sort((a, b) => a.price - b.price);
    else if (filters.sort === 'high-low') items.sort((a, b) => b.price - a.price);
    return items;
  }, [filters, searchTerm, foodItems]);

  const toggleRatingFilter = () => {
    setFilters(prev => ({ ...prev, minRating: prev.minRating === 4 ? 0 : 4 }));
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bebas tracking-wide mb-2">OUR FULL MENU</h1>
          <p className="text-sm text-neutral-500">The best ingredients for the best taste</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm mb-10 sticky top-20 z-30 border border-neutral-100 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                className={`px-4 md:px-5 py-2 rounded-full font-bold transition-all text-[10px] md:text-sm ${filters.category === cat ? 'bg-yellow-400 text-neutral-900 shadow-md' : 'bg-slate-50 text-neutral-500 hover:bg-neutral-100'}`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-center md:justify-end">
            <input 
              type="text" 
              placeholder="Find food..." 
              className="flex-grow lg:w-48 px-4 py-2 bg-slate-50 rounded-full text-sm outline-none focus:ring-2 focus:ring-yellow-400 border border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={toggleRatingFilter}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-2 border-2 ${filters.minRating === 4 ? 'bg-yellow-400 border-yellow-400 text-neutral-900 shadow-sm' : 'bg-white border-neutral-100 text-neutral-500 hover:border-yellow-400'}`}
            >
              <span>★ 4.0+</span>
            </button>
            <select 
              className="px-4 py-2 bg-slate-50 rounded-full text-xs font-bold text-neutral-600 outline-none border border-transparent"
              value={filters.sort}
              onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value as any }))}
            >
              <option value="none">Sort By</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredItems.map(item => <FoodCard key={item.id} item={item} />)}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="text-xl font-bold text-neutral-800">No items found</h3>
            <button onClick={() => {setFilters({category:'All',sort:'none',onlyDiscounted:false,minRating:0}); setSearchTerm('');}} className="mt-4 text-yellow-600 underline font-bold">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
