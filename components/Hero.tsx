
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../StoreContext.tsx';

const Hero: React.FC = () => {
  const { settings } = useStore();

  return (
    <section className="relative w-full yellow-bg pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        <div className="w-full lg:w-1/2 text-center lg:text-left z-10 order-2 lg:order-1">
          <p className="inline-block bg-neutral-900 text-white font-bold px-4 py-1 rounded mb-6 text-xs md:text-sm">
            IT IS A GOOD TIME FOR THE GREAT TASTE AT {settings.name}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bebas leading-[0.9] text-neutral-900 mb-6 drop-shadow-sm">
            {settings.name.split(' ')[0]} <br /> <span className="text-white lg:text-neutral-900">{settings.name.split(' ')[1] || 'SPECIAL'}</span>
          </h1>
          <div className="flex flex-col sm:flex-row items-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <Link to="/menu" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-10 py-4 rounded-lg transition-all shadow-xl hover:scale-105 text-center">
              ORDER NOW
            </Link>
            <Link to="/menu" className="w-full sm:w-auto bg-neutral-900 hover:bg-black text-white font-bold text-lg px-10 py-4 rounded-lg transition-all shadow-xl hover:scale-105 text-center">
              VIEW MENU
            </Link>
          </div>
          <div className="flex items-center justify-center lg:justify-start space-x-4">
             <div className="w-16 h-16 bg-red-600 rounded-full flex flex-col items-center justify-center text-white border-2 border-dashed border-white flex-shrink-0">
                <span className="text-xs font-bold leading-none">$</span>
                <span className="text-xl font-bebas leading-none">5</span>
                <span className="text-[10px] uppercase font-bold leading-none">Only</span>
             </div>
             <p className="text-neutral-900 font-bold max-w-[200px] text-sm leading-snug text-left">
               GRAB OUR WEEKLY SPECIAL AT A CRAZY PRICE!
             </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end order-1 lg:order-2">
          <div className="relative w-full max-w-[400px] md:max-w-[500px] lg:max-w-[600px] aspect-square flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-white/20 rounded-full blur-3xl -z-10"></div>
            <img 
              src="https://pngimg.com/uploads/burger_sandwich/burger_sandwich_PNG4135.png" 
              alt="Delicious Meal" 
              className="w-full h-auto object-contain burger-hero-shadow animate-float transition-transform hover:scale-110 duration-500"
              style={{ animation: 'float 4s ease-in-out infinite' }}
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=600&h=600&fit=crop" }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
