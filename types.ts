
export enum ThemeType {
  NAVY_GOLD = 'NAVY_GOLD',
  GREEN_COPPER = 'GREEN_COPPER',
  BLACK_TURQUOISE = 'BLACK_TURQUOISE',
  BURGUNDY_SILVER = 'BURGUNDY_SILVER',
  SAND_ANDALUSIAN = 'SAND_ANDALUSIAN'
}

export interface AppTheme {
  id: ThemeType;
  name: string;
  bg: string;
  primary: string;
  accent: string;
  textColor: string;
  secondaryTextColor: string;
  borderPattern: string;
  swatch: string[];
}

export interface InfographicContent {
  title: string;
  hook: string;
  mindMap: string[];
  spiritualTouch: string;
}

export interface GenerationResult {
  surahName: string;
  parts: InfographicContent[];
}
