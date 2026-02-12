import React, { useState } from 'react';
import Summary from './Summary';
import Roadmap from './Roadmap';
import { ChevronLeft, Printer, ShieldCheck, Download, Globe } from 'lucide-react';

const ResultDisplay = ({ data, onReset }) => {
  const [lang, setLang] = useState('en'); // 'en' or 'hi'

  // Helper function to extract current language data
  const getLocalizedData = () => ({
    summary: lang === 'en' ? data.simplified_summary : data.simplified_summary_hi,
    roadmap: lang === 'en' ? data.roadmap : data.roadmap_hi,
    rights: lang === 'en' ? data.rights_and_warnings : data.rights_and_warnings_hi,
    audio: lang === 'en' ? data.audio_script_en : data.audio_script_hi
  });

  const localized = getLocalizedData();

  return (
    <div className="animate-fade-in space-y-10">
      {/* Action Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gold/20 pb-8">
        <div>
          <button 
            onClick={onReset}
            className="flex items-center gap-2 text-gold/60 hover:text-gold transition-all text-xs uppercase tracking-[0.2em] mb-4 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Analyze New Document
          </button>
          <h2 className="font-cinzel text-4xl text-white tracking-widest">
            Case <span className="text-gold">Intelligence</span> Report
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* 🌐 Language Switcher Toggle */}
          <div className="flex items-center bg-legalCharcoal/50 border border-gold/30 rounded-full p-1 mr-2 shadow-inner">
            <Globe size={14} className="text-gold mx-2" />
            <button 
              onClick={() => setLang('en')}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${lang === 'en' ? 'bg-gold text-black shadow-lg' : 'text-gold/40 hover:text-gold'}`}
            >
              English
            </button>
            <button 
              onClick={() => setLang('hi')}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${lang === 'hi' ? 'bg-gold text-black shadow-lg' : 'text-gold/40 hover:text-gold'}`}
            >
              हिन्दी
            </button>
          </div>

          <button 
            onClick={() => window.print()}
            className="p-3 bg-legalCharcoal border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all rounded-md"
            title="Print Report"
          >
            <Printer size={20} />
          </button>
          <button className="flex items-center gap-3 px-6 py-3 bg-gold text-black font-bold uppercase tracking-widest text-xs hover:bg-yellow-600 transition-all rounded-md shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <Download size={18} /> Export Analysis
          </button>
        </div>
      </div>

      {/* Main Grid: Summary (Left) and Roadmap (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Summary Section - Takes 5 columns */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* We pass the localized summary and audio script into the Summary component */}
          <Summary data={{ ...data, summary: localized.summary, audio: localized.audio }} />
          
          {/* Trust Badge */}
          <div className="bg-gold/5 border border-gold/20 p-4 rounded-lg flex items-center gap-4">
            <ShieldCheck className="text-gold" size={32} />
            <p className="text-[10px] text-silver/60 leading-relaxed uppercase tracking-widest">
              {lang === 'en' 
                ? "NyayMitra AI has cross-referenced this document with the Indian Penal Code (IPC) and Bhartiya Nyaya Sanhita (BNS) protocols."
                : "न्यायमित्र AI ने इस दस्तावेज़ का भारतीय दंड संहिता (IPC) और भारतीय न्याय संहिता (BNS) प्रोटोकॉल के साथ मिलान किया है।"}
            </p>
          </div>
        </div>

        {/* Roadmap Section - Takes 7 columns */}
        <div className="lg:col-span-7">
          <Roadmap steps={localized.roadmap} />
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;