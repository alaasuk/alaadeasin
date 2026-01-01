
import React from 'react';
import { AppTheme, InfographicContent } from '../types';

interface InfographicPreviewProps {
  content: InfographicContent;
  theme: AppTheme;
  index: number;
  isForCapture?: boolean; // خاصية جديدة لتسهيل التحميل بدون مشاكل تقنية
}

const InfographicPreview: React.FC<InfographicPreviewProps> = ({ content, theme, index, isForCapture = false }) => {
  // استخدام ألوان صلبة بدلاً من الشفافيات المعقدة عند التحميل لضمان جودة النص
  const headerBg = isForCapture ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)';
  
  return (
    <div 
      id={isForCapture ? `capture-card-${index}` : `infographic-card-${index}`}
      className="relative shadow-2xl overflow-hidden flex flex-col items-center p-6 select-none"
      style={{ 
        backgroundColor: theme.bg,
        width: isForCapture ? '1080px' : '100%',
        height: isForCapture ? '1920px' : 'auto',
        aspectRatio: isForCapture ? 'unset' : '9/16'
      }}
    >
      {/* Organic Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[40%] rounded-full blur-[80px]" style={{ backgroundColor: theme.accent }} />
        <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[40%] rounded-full blur-[80px]" style={{ backgroundColor: theme.accent }} />
      </div>

      {/* Decorative Wave Pattern */}
      {!isForCapture && <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')` }} />}

      {/* Part Badge */}
      <div className="absolute top-8 right-8 z-30">
        <div className="bg-black/40 text-white px-4 py-2 rounded-full border border-white/20 font-bold" style={{ fontSize: isForCapture ? '24px' : '10px' }}>
          البطاقة {index + 1}
        </div>
      </div>

      {/* Main Arch Header */}
      <div className="relative z-10 w-full mt-8 flex flex-col items-center">
        {/* Top Circle Ornament */}
        <div 
          className="absolute z-20 rounded-full bg-white flex items-center justify-center shadow-lg"
          style={{ 
            top: isForCapture ? '-30px' : '-12px',
            width: isForCapture ? '60px' : '32px',
            height: isForCapture ? '60px' : '32px'
          }}
        >
           <div 
            className="rounded-full" 
            style={{ 
              backgroundColor: theme.bg,
              width: isForCapture ? '20px' : '8px',
              height: isForCapture ? '20px' : '8px'
            }} 
           />
        </div>

        {/* The Arch Body */}
        <div 
          className="w-full border-[4px] rounded-t-[120px] rounded-b-3xl text-center"
          style={{ 
            borderColor: theme.accent,
            backgroundColor: headerBg,
            paddingTop: isForCapture ? '80px' : '40px',
            paddingBottom: isForCapture ? '60px' : '32px',
            paddingLeft: isForCapture ? '40px' : '24px',
            paddingRight: isForCapture ? '40px' : '24px'
          }}
        >
          <h2 
            className="font-heading font-black text-white leading-relaxed"
            style={{ fontSize: isForCapture ? '54px' : '22px' }}
          >
            {content.hook}
          </h2>
        </div>
      </div>

      {/* Content Boxes (Mind Map) */}
      <div className="relative z-10 flex-grow w-full flex flex-col gap-6 px-2 justify-center py-10">
        {content.mindMap.map((point, idx) => (
          <div 
            key={idx}
            className="w-full border-[4px] border-white shadow-2xl flex items-center justify-center"
            style={{ 
              backgroundColor: theme.bg, 
              borderRadius: isForCapture ? '80px' : '2.5rem',
              padding: isForCapture ? '40px' : '16px',
              minHeight: isForCapture ? '180px' : 'auto'
            }}
          >
            <p 
              className="text-center text-white font-bold font-heading leading-snug"
              style={{ fontSize: isForCapture ? '42px' : '18px' }}
            >
              {point}
            </p>
          </div>
        ))}
      </div>

      {/* Footer Label */}
      <div className="relative z-10 w-full mt-auto pb-10">
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-1.5 bg-white/30 rounded-full" />
          <p 
            className="text-white/80 font-bold font-heading tracking-widest text-center mt-4 px-10 leading-relaxed"
            style={{ fontSize: isForCapture ? '32px' : '14px' }}
          >
             {content.spiritualTouch} 
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfographicPreview;
