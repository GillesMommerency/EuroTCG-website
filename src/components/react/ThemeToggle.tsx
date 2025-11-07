import React, { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    document.documentElement.classList.toggle('dark', newTheme === 'dark');

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  if (!mounted) {
    return <div className="border-input bg-background h-10 w-10 rounded-md border" />;
  }

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '2.5rem',
        width: '2.5rem',
        borderRadius: '0.375rem',
        border: '1px solid hsl(var(--border))',
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = 'hsl(var(--accent))';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'hsl(var(--background))';
      }}
      aria-label="Toggle theme"
      type="button"
    >
      {theme === 'light' ? (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
