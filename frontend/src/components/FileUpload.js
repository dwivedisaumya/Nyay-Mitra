import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, FileText, ShieldCheck, AlertCircle, Scale } from 'lucide-react';

const FileUpload = ({ setAnalysisResult }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(15); // Sync with backend cooldown

  // Simple countdown timer logic for the demo
  useEffect(() => {
    let interval = null;
    if (loading && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading, timer]);

  const handleUpload = async (selectedFile) => {
    setLoading(true);
    setError(null);
    setTimer(15); // Reset timer on new upload
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/documents/process', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysisResult(response.data);
    } catch (err) {
      console.error("Upload Error:", err);
      setError("Quota Limit Reached or Server Offline. Please wait 60s.");
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-10">
      <div className={`relative group border-2 border-dashed rounded-xl p-12 transition-all duration-300 
        ${file ? 'border-gold bg-gold/5' : 'border-gold/30 hover:border-gold hover:bg-gold/5 shadow-lg'}`}>
        
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          onChange={onFileChange}
          disabled={loading}
          accept=".pdf,image/*"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {!file ? (
            <>
              <div className="p-4 bg-gold/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Upload className="text-gold" size={48} />
              </div>
              <div className="text-center">
                <h3 className="font-cinzel text-2xl text-white tracking-widest uppercase">Submit Document</h3>
                <p className="text-silver/60 mt-2 font-serif italic">Drag & drop or click to upload PDF/Image</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative">
                <FileText className={`text-gold mb-2 ${loading ? 'animate-bounce' : ''}`} size={48} />
                {loading && <Scale className="absolute -top-2 -right-2 text-gold animate-pulse" size={20} />}
              </div>
              <span className="text-white font-medium">{file.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* --- MODIFIED STATUS SECTION --- */}
      <div className="mt-8 min-h-[100px] flex flex-col items-center">
        {loading && (
          <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center space-y-4 bg-gold/5 p-6 rounded-xl border border-gold/20 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gold font-bold tracking-[0.2em] text-xs uppercase">
                  NyayMitra Analysis in Progress ({timer}s)
                </span>
              </div>
              
              <p className="text-silver/80 text-sm text-center leading-relaxed font-serif italic">
                "NyayMitra is now performing a multimodal legal analysis. It extracts text and visual data simultaneously 
                using Gemini 2.0 Flash-Lite, then maps it to the relevant Indian legal codes in both English and Sahaj Hindi."
              </p>

              {/* Progress Bar Visual */}
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-gold h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((15 - timer) / 15) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-md border border-red-500/20">
            <AlertCircle size={16} />
            <span className="text-xs font-bold uppercase">{error}</span>
          </div>
        )}

        {!loading && !error && (
          <div className="flex items-center gap-2 text-silver/40 text-[10px] uppercase tracking-widest">
            <ShieldCheck size={14} className="text-gold/40" />
            <span>Secure AI Legal Processing • Indian Law Compliance</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;