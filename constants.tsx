
import { ThemeType, AppTheme } from './types';

export const THEMES: AppTheme[] = [
  {
    id: ThemeType.BURGUNDY_SILVER,
    name: 'العنابي الملكي',
    bg: '#3d0808', 
    primary: '#ffffff',
    accent: '#e2e8f0', // Silver
    textColor: '#ffffff',
    secondaryTextColor: '#f1f5f9',
    swatch: ['#3d0808', '#e2e8f0'],
    borderPattern: 'opacity-10'
  },
  {
    id: ThemeType.NAVY_GOLD,
    name: 'الكحلي والذهبي',
    bg: '#0f172a', 
    primary: '#ffffff',
    accent: '#fbbf24', // Gold
    textColor: '#ffffff',
    secondaryTextColor: '#e2e8f0',
    swatch: ['#0f172a', '#fbbf24'],
    borderPattern: 'opacity-10'
  },
  {
    id: ThemeType.GREEN_COPPER,
    name: 'الأخضر الزمردي',
    bg: '#064e3b',
    primary: '#ffffff',
    accent: '#10b981', // Emerald
    textColor: '#ffffff',
    secondaryTextColor: '#ecfdf5',
    swatch: ['#064e3b', '#10b981'],
    borderPattern: 'opacity-10'
  },
  {
    id: ThemeType.SAND_ANDALUSIAN,
    name: 'الرملي الأندلسي',
    bg: '#451a03', // Warm Earthy
    primary: '#ffffff',
    accent: '#f59e0b', // Amber/Gold
    textColor: '#ffffff',
    secondaryTextColor: '#fff7ed',
    swatch: ['#451a03', '#f59e0b'],
    borderPattern: 'opacity-10'
  },
  {
    id: ThemeType.BLACK_TURQUOISE,
    name: 'الأسود الفيروزي',
    bg: '#111827',
    primary: '#ffffff',
    accent: '#2dd4bf', // Turquoise
    textColor: '#ffffff',
    secondaryTextColor: '#f0fdfa',
    swatch: ['#111827', '#2dd4bf'],
    borderPattern: 'opacity-10'
  },
  {
    id: ThemeType.BURGUNDY_SILVER, // Reuse ID for simplicity in mapping
    name: 'الأموي البنفسجي',
    bg: '#2e1065',
    primary: '#ffffff',
    accent: '#d8b4fe',
    textColor: '#ffffff',
    secondaryTextColor: '#faf5ff',
    swatch: ['#2e1065', '#d8b4fe'],
    borderPattern: 'opacity-10'
  }
];
