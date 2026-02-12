import React, { useEffect, useState } from 'react';
import { Scale } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Wait 3 seconds for the pop animation, then trigger exit
    const timer = setTimeout(() => {
      setIsExiting(true);
      // Give the exit animation 800ms to finish before hiding component
      setTimeout(onComplete, 800);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-legalBlack perspective-1000 ${isExiting ? 'animate-screen-exit' : ''}`}>
      <div className="text-center animate-pop-out">
        {/* Glowing 3D Icon */}
        <div className="relative mb-6 flex justify-center">
          <div className="absolute inset-0 bg-gold/30 blur-3xl rounded-full"></div>
          <Scale size={100} className="text-gold relative drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
        </div>

        {/* 3D Text Effect */}
        <h1 className="font-cinzel text-6xl font-bold tracking-[0.3em] text-white">
          NYAY<span className="text-gold">MITRA</span>
        </h1>
        
        <div className="mt-4 flex flex-col items-center">
          <p className="text-silver font-serif italic tracking-widest text-xl opacity-80">
            Establishing Equity Through AI
          </p>
          
          {/* Elegant Gold Progress Bar */}
          <div className="mt-8 w-64 h-[2px] bg-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gold animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;