import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface LanguageSwitcherProps {
  currentLocale: string;
  languageUrls?: Record<string, string>;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLocale, languageUrls }) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  ];

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    if (languageUrls && languageUrls[langCode]) {
      window.location.href = languageUrls[langCode];
    } else {
      const currentPath = window.location.pathname;
      const currentPathWithoutLocale = currentPath.replace(/^\/[a-z]{2}(?=\/|$)/, '');
      const newPath =
        langCode === 'en'
          ? currentPathWithoutLocale || '/'
          : `/${langCode}${currentPathWithoutLocale || '/'}`;

      window.location.href = newPath;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'border-input bg-background flex items-center gap-2 rounded-md border px-3 py-2',
          'text-foreground text-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus:ring-primary focus:outline-none focus:ring-2 focus:ring-offset-2'
        )}
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-lg leading-none">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        <svg
          className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute right-0 top-full z-50 mt-2',
            'border-input bg-background min-w-[160px] rounded-md border shadow-lg',
            'text-foreground py-1 text-sm'
          )}
        >
          {languages.map(language => (
            <button
              key={language.code}
              onClick={() => {
                handleLanguageChange(language.code);
                setIsOpen(false);
              }}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-2 text-left',
                'hover:bg-accent hover:text-accent-foreground',
                'focus:bg-accent focus:text-accent-foreground focus:outline-none',
                currentLocale === language.code && 'bg-accent text-accent-foreground'
              )}
            >
              <span className="text-lg leading-none">{language.flag}</span>
              <span>{language.name}</span>
              {currentLocale === language.code && (
                <svg
                  className="ml-auto h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-hidden="true" />
      )}
    </div>
  );
};

export default LanguageSwitcher;
