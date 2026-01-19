
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../StoreContext.tsx';

const Footer: React.FC = () => {
  const { settings } = useStore();

  return (
    <footer className="bg-neutral-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 yellow-bg rounded-lg flex items-center justify-center overflow-hidden">
                {settings.isLogoImage ? (
                  <img src={settings.logo} className="w-full h-full object-cover" alt="Logo" />
                ) : (
                  <span className="text-xl">{settings.logo}</span>
                )}
              </div>
              <span className="text-2xl font-bebas tracking-wider text-white">{settings.name}</span>
            </div>
            <p className="text-neutral-400 mb-6 leading-relaxed">
              We serve the best food in the city. Made with premium ingredients, fresh produce, and lots of love at {settings.name}.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-bebas tracking-wide mb-6">QUICK LINKS</h4>
            <ul className="space-y-4 text-neutral-400">
              <li><Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link></li>
              <li><Link to="/menu" className="hover:text-yellow-400 transition-colors">Our Menu</Link></li>
              <li><Link to="/about" className="hover:text-yellow-400 transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bebas tracking-wide mb-6">OPERATING HOURS</h4>
            <ul className="space-y-4 text-neutral-400">
              <li className="flex justify-between"><span>Mon - Thu:</span> <span>11:00 AM - 11:00 PM</span></li>
              <li className="flex justify-between"><span>Fri - Sat:</span> <span>11:00 AM - 01:00 AM</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bebas tracking-wide mb-6">CONTACT</h4>
            <ul className="space-y-4 text-neutral-400">
              <li>123 Food Street, Tasty City, NY</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-800 pt-10 text-center text-neutral-500 text-sm">
          <p>© 2024 {settings.name}. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
