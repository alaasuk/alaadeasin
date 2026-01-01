
import React from 'react';
import { AppTheme } from '../types';

interface ThemeOptionProps {
  theme: AppTheme;
  isSelected: boolean;
  onSelect: (theme: AppTheme) => void;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({ theme, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(theme)}
      className={`w-full flex items-center justify-between p-4 mb-3 rounded-2xl border-2 transition-all duration-300 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50/50' 
          : 'border-slate-100 hover:border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {theme.swatch.map((color, idx) => (
            <div 
              key={idx} 
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm" 
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
          {theme.name}
        </span>
      </div>
      
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
        isSelected ? 'border-blue-500' : 'border-slate-300'
      }`}>
        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
      </div>
    </button>
  );
};

export default ThemeOption;
