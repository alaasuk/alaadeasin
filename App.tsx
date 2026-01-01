
import React, { useState, useEffect } from 'react';
import { THEMES } from './constants';
import { ThemeType, AppTheme, GenerationResult } from './types';
import ThemeOption from './components/ThemeOption';
import InfographicPreview from './components/InfographicPreview';
import { generateInfographicContent } from './services/geminiService';

declare var html2canvas: any;

// Define the AIStudio interface to match the expected global type
interface AIStudio {
  hasSelectedApiKey(): Promise<boolean>;
  openSelectKey(): Promise<void>;
}

declare global {
  interface Window {
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<number | null>(null);
  const [isKeyReady, setIsKeyReady] = useState<boolean>(true);

  const loadingMessages = [
    "جاري تصميم المحراب الرقمي...",
    "تنسيق الزخارف الفضية...",
    "تجهيز بطاقات المعلومات...",
    "وضع اللمسات الروحانية الأخيرة..."
  ];

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        try {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          // إذا لم يكن هناك مفتاح في البيئة ولا مفتاح مختار يدوياً
          if (!hasKey && !process.env.API_KEY) {
            setIsKeyReady(false);
          }
        } catch (e) {
          console.error("Error checking API key:", e);
        }
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setIsKeyReady(true);
      } catch (e) {
        console.error("Error opening key dialog:", e);
      }
    }
  };

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
      if (!data || !data.parts) throw new Error("لم تصل بيانات صحيحة من الخادم.");
      setResult(data);
    } catch (err: any) {
      console.error("Critical Generation failure:", err);
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("API_KEY")) {
        setIsKeyReady(false);
        setError("المفتاح غير مفعل أو غير صالح. يرجى الضغط على زر 'إعداد المفتاح' بالأعلى.");
      } else {
        setError(err.message || "حدث خطأ غير متوقع. يرجى التأكد من مفتاح الـ API والمحاولة لاحقاً.");
      }
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  const downloadImage = async (index: number) => {
    const element = document.getElementById(`capture-card-${index}`);
    if (!element) return;

    setIsDownloading(index);
    try {
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2, 
        backgroundColor: selectedTheme.bg,
        logging: false,
        allowTaint: true,
        width: element.offsetWidth,
        height: element.offsetHeight,
        onclone: (clonedDoc: Document) => {
          const card = clonedDoc.getElementById(`capture-card-${index}`);
          if (card) {
            card.style.display = 'flex';
            card.style.position = 'relative';
            card.setAttribute('dir', 'rtl');
            card.style.fontFamily = "'Tajawal', sans-serif";
          }
        }
      });
      
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.download = `AlMihrab-${index + 1}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setIsDownloading(null);
    }
  };

  const downloadAll = async () => {
    if (!result) return;
    for (let i = 0; i < result.parts.length; i++) {
      await downloadImage(i);
      await new Promise(resolve => setTimeout(resolve, 800)); 
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center p-4 md:p-8" dir="rtl">
      {/* زر إعداد المفتاح في أعلى الصفحة دائماً */}
      <div className="fixed top-4 left-4 z-[100]">
        <button 
          onClick={handleSelectKey}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 rounded-full text-amber-500 text-sm font-bold shadow-lg transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          إعداد مفتاح الـ API
        </button>
      </div>

      {result && (
        <div className="capture-hidden-layer" aria-hidden="true" dir="rtl">
          {result.parts.map((part, idx) => (
            <InfographicPreview 
              key={`cap-${idx}`}
              index={idx}
              content={part}
              theme={selectedTheme}
              isForCapture={true}
            />
          ))}
        </div>
      )}

      <header className="w-full max-w-lg flex flex-col items-center mb-10 mt-12">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-2xl flex items-center justify-center text-white shadow-2xl mb-4 border border-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-1">استوديو المحراب</h1>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-widest text-center">التصميم الذكي للمحتوى الإيماني</p>
      </header>

      {!isKeyReady ? (
        <main className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 border border-white/10 flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">تفعيل الاتصال بالذكاء الاصطناعي</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            لضمان عمل الأداة على Netlify، يرجى تفعيل مفتاح الـ API الخاص بك يدوياً من الزر في الأعلى أو الزر أدناه.
          </p>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-500 text-xs font-bold underline mb-2"
          >
            تعرف على متطلبات الدفع (Google Billing)
          </a>
          <button 
            onClick={handleSelectKey}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white font-black shadow-xl transition-all"
          >
            إعداد مفتاح الـ API الآن
          </button>
        </main>
      ) : !result ? (
        <main className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 border border-white/10 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-slate-400 font-bold text-xs uppercase tracking-widest px-1">الموضوع</label>
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="سورة الفاتحة، بر الوالدين..."
              className="w-full p-5 bg-black/20 border-2 border-white/5 focus:border-emerald-500/50 rounded-2xl outline-none transition-all text-lg font-bold text-white"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-slate-400 font-bold text-xs uppercase tracking-widest px-1">الطابع اللوني</label>
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {THEMES.map((theme, idx) => (
                <button
                  key={`th-${idx}`}
                  onClick={() => setSelectedTheme(theme)}
                  className={`flex flex-col gap-2 p-3 rounded-xl border-2 transition-all ${
                    selectedTheme.name === theme.name ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5'
                  }`}
                >
                  <div className="flex gap-1">
                    {theme.swatch.map((c, i) => (
                      <div key={`sw-${i}`} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
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
            className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-white text-lg font-black shadow-2xl transition-all ${
              !topic || isGenerating ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{loadingMessages[loadingStep]}</span>
              </div>
            ) : "بدء التصميم"}
          </button>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center leading-relaxed">
              {error}
            </div>
          )}
        </main>
      ) : (
        <main className="w-full max-w-6xl flex flex-col items-center gap-10">
          <div className="w-full flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10">
            <h2 className="text-3xl font-black text-white">{result.surahName}</h2>
            <div className="flex gap-2">
               <button onClick={handleSelectKey} className="text-white/60 hover:text-white bg-white/5 px-4 py-2 rounded-xl text-xs font-bold transition-all">تغيير المفتاح</button>
               <button onClick={() => {setResult(null); setTopic(''); setError(null);}} className="text-white bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-xl font-bold transition-all">موضوع جديد</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
            {result.parts.map((part, idx) => (
              <div key={`res-${idx}`} className="flex flex-col gap-4">
                 <InfographicPreview index={idx} content={part} theme={selectedTheme} />
                 <button onClick={() => downloadImage(idx)} className="w-full py-4 rounded-xl bg-white/10 hover:bg-emerald-600 text-white font-bold flex justify-center gap-2">
                   {isDownloading === idx ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "حفظ الصورة"}
                 </button>
              </div>
            ))}
          </div>
          <button onClick={downloadAll} className="px-10 py-6 bg-emerald-600 rounded-2xl font-black text-xl shadow-2xl text-white mb-16 hover:bg-emerald-500 transition-all">تحميل المجموعة كاملة</button>
        </main>
      )}
    </div>
  );
};

export default App;
