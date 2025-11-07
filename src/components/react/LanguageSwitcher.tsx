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
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          border: '1px solid hsl(var(--border))',
          borderRadius: '0.375rem',
          backgroundColor: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          fontSize: '0.875rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = 'hsl(var(--accent))';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'hsl(var(--background))';
        }}
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-lg leading-none">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        <svg
          style={{
            height: '1rem',
            width: '1rem',
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
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
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            zIndex: 50,
            marginTop: '0.5rem',
            minWidth: '160px',
            borderRadius: '0.375rem',
            border: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            padding: '0.25rem 0',
            fontSize: '0.875rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          }}
        >
          {languages.map(language => (
            <button
              key={language.code}
              onClick={() => {
                handleLanguageChange(language.code);
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 1rem',
                textAlign: 'left',
                backgroundColor:
                  currentLocale === language.code ? 'hsl(var(--accent))' : 'transparent',
                color:
                  currentLocale === language.code
                    ? 'hsl(var(--accent-foreground))'
                    : 'hsl(var(--foreground))',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                if (currentLocale !== language.code) {
                  e.currentTarget.style.backgroundColor = 'hsl(var(--accent))';
                  e.currentTarget.style.color = 'hsl(var(--accent-foreground))';
                }
              }}
              onMouseLeave={e => {
                if (currentLocale !== language.code) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'hsl(var(--foreground))';
                }
              }}
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
