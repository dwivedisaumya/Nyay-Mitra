import React, { useState, useEffect } from 'react';
import { FileText, Volume2, Square, Download, Share2 } from 'lucide-react';

const Summary = ({ data }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Use the bilingual summary if available, fallback to single language fields
  const summaryText = data?.summary || data?.simplified_summary || "Analysis pending...";
  
  // Determine language: Check if the text contains Hindi characters or if a lang prop is passed
  // For this version, we'll assume the parent passes the correct 'summary' string
  const isHindi = /[\u0900-\u097F]/.test(summaryText);

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(summaryText);
      
      // 🌐 Bilingual Language Support
      utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
      utterance.rate = isHindi ? 0.85 : 0.9; // Hindi sounds better slightly slower
      utterance.pitch = 1;

      // Ensure we pick the best voice available in the browser
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang === utterance.lang && v.name.includes('Google'));
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Required for some browsers to load voices properly
    window.speechSynthesis.getVoices();
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <div className="bg-legalCharcoal border border-gold/20 rounded-xl overflow-hidden shadow-2xl animate-fade-in flex flex-col h-full">
      <div className="bg-white/5 border-b border-gold/10 p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FileText className="text-gold" size={20} />
          <h3 className="font-cinzel text-lg text-white tracking-widest uppercase">
            {isHindi ? "दस्तावेज़ सारांश" : "Document Abstract"}
          </h3>
        </div>
        
        <button 
          onClick={toggleSpeech}
          className={`p-2 rounded-full transition-all shadow-lg ${isSpeaking ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-gold/10 text-gold hover:bg-gold hover:text-black'}`}
        >
          {isSpeaking ? <Square size={18} fill="currentColor" /> : <Volume2 size={18} />}
        </button>
      </div>

      <div className="p-8 flex-grow">
        <div className="prose prose-invert max-w-none">
          <p className={`leading-relaxed text-silver/90 ${isHindi ? 'font-sans text-xl' : 'font-serif text-lg first-letter:text-4xl first-letter:font-cinzel first-letter:text-gold first-letter:mr-2 first-letter:float-left'}`}>
            {summaryText}
          </p>
        </div>
      </div>

      <div className="p-6 bg-black/20 flex justify-end gap-4 border-t border-gold/5">
        <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-silver/60 hover:text-gold transition-colors font-bold">
          <Download size={14} /> {isHindi ? "रिपोर्ट सहेजें" : "Save Report"}
        </button>
        <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-silver/60 hover:text-gold transition-colors font-bold">
          <Share2 size={14} /> {isHindi ? "कानूनी सलाह साझा करें" : "Legal Counsel Share"}
        </button>
      </div>
    </div>
  );
};

export default Summary;