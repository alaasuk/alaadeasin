
import React from 'react';
import { AppTheme, InfographicContent } from '../types';

interface InfographicPreviewProps {
  content: InfographicContent;
  theme: AppTheme;
  index: number;
  isForCapture?: boolean;
}

const InfographicPreview: React.FC<InfographicPreviewProps> = ({ content, theme, index, isForCapture = false }) => {
  // Use solid colors for capture to avoid rendering issues on some mobile devices
  const overlayColor = isForCapture ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)';
  
  return (
    <div 
      id={isForCapture ? `capture-card-${index}` : `infographic-card-${index}`}
      className="relative shadow-2xl overflow-hidden flex flex-col items-center p-6 select-none"
      style={{ 
        backgroundColor: theme.bg,
        width: isForCapture ? '800px' : '100%', // Reduced width slightly for better mobile compatibility
        height: isForCapture ? '1422px' : 'auto',
        aspectRatio: isForCapture ? 'unset' : '9/16'
      }}
    >
      {/* Background Ornaments */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-5%] left-[-10%] w-[70%] h-[30%] rounded-full blur-[70px]" style={{ backgroundColor: theme.accent }} />
        <div className="absolute bottom-[-5%] right-[-10%] w-[70%] h-[30%] rounded-full blur-[70px]" style={{ backgroundColor: theme.accent }} />
      </div>

      {/* Part Badge */}
      <div className="absolute top-6 right-6 z-30">
        <div className="bg-black/40 text-white px-3 py-1 rounded-full border border-white/20 font-bold" style={{ fontSize: isForCapture ? '18px' : '10px' }}>
          البطاقة {index + 1}
        </div>
      </div>

      {/* Main Arch Header */}
      <div className="relative z-10 w-full mt-6 flex flex-col items-center">
        {/* Top Circle Ornament */}
        <div 
          className="absolute z-20 rounded-full bg-white flex items-center justify-center shadow-lg"
          style={{ 
            top: isForCapture ? '-20px' : '-10px',
            width: isForCapture ? '45px' : '30px',
            height: isForCapture ? '45px' : '30px'
          }}
        >
           <div 
            className="rounded-full" 
            style={{ 
              backgroundColor: theme.bg,
              width: isForCapture ? '15px' : '8px',
              height: isForCapture ? '15px' : '8px'
            }} 
           />
        </div>

        {/* The Arch Body */}
        <div 
          className="w-full border-[3px] rounded-t-[90px] rounded-b-2xl text-center"
          style={{ 
            borderColor: theme.accent,
            backgroundColor: overlayColor,
            paddingTop: isForCapture ? '60px' : '36px',
            paddingBottom: isForCapture ? '40px' : '28px',
            paddingLeft: isForCapture ? '30px' : '20px',
            paddingRight: isForCapture ? '30px' : '20px'
          }}
        >
          <h2 
            className="font-heading font-black text-white leading-relaxed"
            style={{ fontSize: isForCapture ? '42px' : '22px' }}
          >
            {content.hook}
          </h2>
        </div>
      </div>

      {/* Content Boxes */}
      <div className="relative z-10 flex-grow w-full flex flex-col gap-5 px-1 justify-center py-6">
        {content.mindMap.map((point, idx) => (
          <div 
            key={idx}
            className="w-full border-[2.5px] border-white shadow-xl flex items-center justify-center"
            style={{ 
              backgroundColor: theme.bg, 
              borderRadius: isForCapture ? '60px' : '2.5rem',
              padding: isForCapture ? '30px' : '14px',
              minHeight: isForCapture ? '120px' : 'auto'
            }}
          >
            <p 
              className="text-center text-white font-bold font-heading leading-snug"
              style={{ fontSize: isForCapture ? '32px' : '17px' }}
            >
              {point}
            </p>
          </div>
        ))}
      </div>

      {/* Footer Label */}
      <div className="relative z-10 w-full mt-auto pb-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-1 bg-white/20 rounded-full" />
          <p 
            className="text-white/80 font-bold font-heading text-center mt-3 px-6 leading-relaxed"
            style={{ fontSize: isForCapture ? '24px' : '13px' }}
          >
             {content.spiritualTouch} 
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfographicPreview;
