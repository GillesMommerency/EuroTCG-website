// Simple translation function
export function useTranslations(locale: string) {
  // In a real app, you'd dynamically import the locale files
  // For now, we'll just return a simple function
  return (key: string, fallback: string = '') => {
    // This would normally look up the translation
    return fallback || key;
  };
}

// Translation helper type
export type TranslationKey = string;

// Translation function type
export type TranslationFunction = (key: TranslationKey, fallback?: string) => string;