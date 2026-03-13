export type Language = 'en' | 'hi' | 'pa';

export interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
}
