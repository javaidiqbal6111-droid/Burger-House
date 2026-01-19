
import React from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bebas tracking-wide mb-4">OUR STORY</h1>
          <p className="text-neutral-500 max-w-2xl mx-auto">Founded in 2012, Burger House started with a simple mission: to create the ultimate burger experience using only premium, locally sourced ingredients.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <img src="https://images.unsplash.com/photo-1550950158-d0d960dff51b?q=80&w=800&fit=crop" className="rounded-3xl shadow-2xl" alt="Chef" />
          <div>
            <h2 className="text-4xl font-bebas mb-6">FRESHER IS BETTER</h2>
            <p className="text-neutral-600 leading-relaxed mb-6">Every morning, we bake our own brioche buns and grind our premium beef blends. We believe that the foundation of a great burger lies in the quality of its simplest components. That's why we partner with local farmers for organic vegetables and artisan creameries for our signature cheeses.</p>
            <div className="flex space-x-6">
              <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:yellow-bg transition-all group">
                <img src="https://www.svgrepo.com/show/512120/facebook-176.svg" className="w-5 h-5" alt="FB" />
              </a>
              <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:yellow-bg transition-all group">
                <img src="https://www.svgrepo.com/show/521711/instagram.svg" className="w-5 h-5" alt="IG" />
              </a>
              <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:yellow-bg transition-all group">
                <img src="https://www.svgrepo.com/show/513008/twitter-154.svg" className="w-5 h-5" alt="TW" />
              </a>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-[3rem] p-12 text-center text-white">
          <h2 className="text-5xl font-bebas mb-6">READY TO TASTE THE DIFFERENCE?</h2>
          <p className="text-neutral-400 mb-8 max-w-lg mx-auto">Join thousands of satisfied foodies who have made Burger House their #1 choice for premium burgers.</p>
          <button onClick={() => navigate('/menu')} className="yellow-bg text-neutral-900 font-bold px-12 py-4 rounded-xl hover:scale-105 transition-all">ORDER NOW</button>
        </div>
      </div>
    </div>
  );
};

export default About;
