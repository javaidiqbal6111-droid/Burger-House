
import React from 'react';
import { FoodItem } from '../types';
import { useCart } from '../CartContext';

interface FoodCardProps {
  item: FoodItem;
}

const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { addToCart } = useCart();
  const finalPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;

  return (
    <div className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-neutral-100">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4 bg-slate-50">
        {item.discount && (
          <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            {item.discount}% OFF
          </div>
        )}
        {item.isPopular && (
          <div className="absolute top-2 right-2 z-10 bg-yellow-400 text-neutral-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            POPULAR
          </div>
        )}
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-neutral-800 line-clamp-1 text-base">{item.name}</h3>
          <span className="font-bold text-red-600">${finalPrice.toFixed(2)}</span>
        </div>
        
        <p className="text-xs text-neutral-500 line-clamp-2 mb-3 h-8 leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center space-x-1 mb-4 text-[11px] font-semibold">
          <span className="text-yellow-500 text-xs">★</span>
          <span className="text-neutral-700">{item.rating}</span>
          <span className="text-neutral-400">({item.reviews} reviews)</span>
        </div>

        <button 
          onClick={() => addToCart(item)}
          className="w-full mt-auto py-2.5 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-yellow-500 hover:text-neutral-900 transition-all active:scale-95 flex items-center justify-center space-x-2"
        >
          <span>ADD TO CART</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
