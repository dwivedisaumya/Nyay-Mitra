import React from 'react';
import { Scale, Gavel, ShieldCheck } from 'lucide-react';

const Navbar = ({ setView, currentView }) => {
  return (
    <nav className="sticky top-0 z-40 w-full bg-legalCharcoal/90 backdrop-blur-md border-b border-gold/30 px-6 py-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo Section */}
        <div 
          onClick={() => setView('home')} 
          className="flex items-center space-x-3 group cursor-pointer"
        >
          <div className="p-2 bg-gold/10 rounded-lg border border-gold/20 group-hover:border-gold/50 transition-all duration-300">
            <Scale className="text-gold" size={28} />
          </div>
          <h1 className="font-cinzel text-2xl font-bold tracking-[0.2em] text-white">
            NYAY<span className="text-gold">MITRA</span>
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-10">
          <button 
            onClick={() => setView('process')}
            className={`flex items-center gap-2 transition-all duration-300 text-xs font-bold uppercase tracking-[0.2em] 
              ${currentView === 'process' ? 'text-gold' : 'text-silver/60 hover:text-gold'}`}
          >
            <Gavel size={18} />
            <span>Process</span>
          </button>
          
          <button 
            onClick={() => setView('rights')}
            className={`flex items-center gap-2 transition-all duration-300 text-xs font-bold uppercase tracking-[0.2em] 
              ${currentView === 'rights' ? 'text-gold' : 'text-silver/60 hover:text-gold'}`}
          >
            <ShieldCheck size={18} />
            <span>My Rights</span>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;