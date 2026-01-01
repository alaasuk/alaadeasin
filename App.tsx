
import React, { useState, useEffect } from 'react';
import { THEMES } from './constants';
import { ThemeType, AppTheme, GenerationResult } from './types';
import ThemeOption from './components/ThemeOption';
import InfographicPreview from './components/InfographicPreview';
import { generateInfographicContent } from './services/geminiService';

declare var html2canvas: any;

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<AppTheme>(THEMES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<number | null>(null);

  const loadingMessages = [
    "جاري تصميم المحراب الرقمي...",
    "تنسيق الزخارف الفضية...",
    "تجهيز بطاقات المعلومات...",
    "وضع اللمسات الروحانية الأخيرة..."
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setError(null);
    setIsGenerating(true);
    setLoadingStep(0);
    
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % loadingMessages.length);
    }, 2000);

    try {
      const data = await generateInfographicContent(topic);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("عذراً، المحرك مشغول حالياً. حاول مجدداً بعد لحظات.");
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  const downloadImage = async (index: number) => {
    // نستخدم نسخة مخفية من البطاقة مخصصة للتحميل فقط لضمان عدم القص وبجودة ثابتة
    const element = document.getElementById(`capture-card-${index}`);
    if (!element) return;

    setIsDownloading(index);
    try {
      // التأكد من تحميل الخطوط قبل التقاط الصورة
      await document.fonts.ready;

      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 1, // النسخة المخصصة للتحميل هي بالفعل بحجم 1080x1920
        backgroundColor: selectedTheme.bg,
        logging: false,
        width: 1080,
        height: 1920,
        onclone: (clonedDoc: Document) => {
          // يمكن إجراء تعديلات إضافية على النسخة المستنسخة هنا إذا لزم الأمر
          const card = clonedDoc.getElementById(`capture-card-${index}`);
          if (card) {
            card.style.display = 'flex';
          }
        }
      });
      
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = `AlMihrab-${result?.surahName || 'design'}-${index + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download image", err);
      alert("عذراً، واجهنا مشكلة في معالجة الصورة. حاول مجدداً.");
    } finally {
      setIsDownloading(null);
    }
  };

  const downloadAll = async () => {
    if (!result) return;
    for (let i = 0; i < result.parts.length; i++) {
      await downloadImage(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const handleReset = () => {
    setResult(null);
    setTopic('');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center p-4 md:p-8 overflow-x-hidden">
      
      {/* Hidden container for rendering high-quality capture cards */}
      {result && (
        <div className="capture-container" aria-hidden="true">
          {result.parts.map((part, idx) => (
            <InfographicPreview 
              key={`capture-${idx}`}
              index={idx}
              content={part}
              theme={selectedTheme}
              isForCapture={true}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <header className="w-full max-w-lg flex flex-col items-center mb-10 mt-4">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-3xl flex items-center justify-center text-white shadow-2xl mb-4 border border-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-1">استوديو المحراب</h1>
        <p className="text-slate-500 text-sm font-medium italic">إبداع رقمي بروح إيمانية</p>
      </header>

      {!result ? (
        <main className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 border border-white/10 flex flex-col gap-6 animate-in zoom-in-95 duration-500">
          
          <div className="flex flex-col gap-3">
            <label className="text-slate-400 font-bold text-xs uppercase tracking-widest px-1">موضوع التصميم</label>
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="مثلاً: سورة الكهف، فضل الاستغفار..."
              className="w-full p-5 bg-black/20 border-2 border-white/5 focus:border-emerald-500/50 rounded-2xl outline-none transition-all text-lg font-bold text-white placeholder:text-slate-600"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-slate-400 font-bold text-xs uppercase tracking-widest px-1">اختر اللون الملكي</label>
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {THEMES.map((theme, idx) => (
                <button
                  key={theme.name + idx}
                  onClick={() => setSelectedTheme(theme)}
                  className={`flex flex-col gap-2 p-3 rounded-xl border-2 transition-all text-right ${
                    selectedTheme.name === theme.name 
                      ? 'border-emerald-500 bg-emerald-500/10' 
                      : 'border-white/5 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex gap-1">
                    {theme.swatch.map((c, i) => (
                      <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <span className="font-bold text-[11px] truncate w-full text-slate-300">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            disabled={!topic || isGenerating}
            onClick={handleGenerate}
            className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-white text-lg font-black shadow-2xl transition-all active:scale-95 mt-4 ${
              !topic || isGenerating 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 shadow-emerald-900/20'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {loadingMessages[loadingStep]}
              </div>
            ) : "توليد مجموعة الصور"}
          </button>

          {error && <p className="text-red-400 text-center text-xs font-bold mt-2">{error}</p>}
        </main>
      ) : (
        <main className="w-full max-w-6xl flex flex-col items-center gap-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 p-6 rounded-[2rem] border border-white/10">
            <h2 className="text-3xl font-black text-white order-2 md:order-1">{result.surahName}</h2>
            <button 
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-bold flex items-center gap-2 order-1 md:order-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              </svg>
              موضوع جديد
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
            {result.parts.map((part, idx) => (
              <div key={idx} className="flex flex-col gap-4 group">
                 <InfographicPreview 
                  index={idx}
                  content={part}
                  theme={selectedTheme}
                />
                <button 
                  onClick={() => downloadImage(idx)}
                  className={`w-full py-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                    isDownloading === idx ? 'bg-white/20 text-white' : 'bg-white/10 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {isDownloading === idx ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  )}
                  {isDownloading === idx ? 'جاري التحضير...' : 'تحميل صورة عالية الجودة'}
                </button>
              </div>
            ))}
          </div>

          <button 
            onClick={downloadAll}
            className="px-10 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xl shadow-2xl shadow-emerald-900/40 transition-all active:scale-95 mb-16 flex items-center gap-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            تحميل المجموعة كاملة (1080x1920)
          </button>
        </main>
      )}
    </div>
  );
};

export default App;
