import React from 'react';
import { Gavel, Scale, ShieldAlert } from 'lucide-react';

const Header = () => {
  return (
    <header className="text-center py-16 px-4 animate-fade-in">
      {/* Decorative Icon Row */}
      <div className="flex justify-center items-center gap-6 mb-8">
        <div className="h-[1px] w-12 bg-gold/30"></div>
        <Gavel className="text-gold/50" size={24} />
        <div className="h-[1px] w-12 bg-gold/30"></div>
      </div>

      {/* Main Title */}
      <h1 className="font-cinzel text-5xl md:text-7xl font-bold text-white tracking-[0.25em] mb-6">
        NYAY<span className="text-gold">MITRA</span>
      </h1>

      {/* Subtitle / Tagline */}
      <div className="max-w-2xl mx-auto">
        <p className="font-serif text-xl md:text-2xl text-silver/80 italic tracking-wide leading-relaxed">
          "Where Artificial Intelligence meets the Scales of Justice."
        </p>
      </div>

      {/* Feature Pills */}
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        <div className="flex items-center gap-2 px-4 py-2 bg-legalCharcoal border border-gold/20 rounded-sm">
          <Scale size={16} className="text-gold" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-silver font-bold">Precise Analysis</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-legalCharcoal border border-gold/20 rounded-sm">
          <ShieldAlert size={16} className="text-gold" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-silver font-bold">Confidential & Secure</span>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="mt-12 flex justify-center">
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"></div>
      </div>
    </header>
  );
};

export default Header;