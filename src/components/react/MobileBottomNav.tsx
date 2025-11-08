import React, { useState } from 'react';

interface MobileBottomNavProps {
  className?: string;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState('cards');

  const navItems = [
    {
      id: 'cards',
      label: 'Cards',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      href: '#cards',
    },
    {
      id: 'scanner',
      label: 'Scanner',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      href: '#scanner',
      isSpecial: true,
    },
    {
      id: 'prices',
      label: 'Prices',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      href: '#prices',
    },
    {
      id: 'achievements',
      label: 'Goals',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
      href: '#progress-game',
    },
  ];

  const handleNavClick = (item: (typeof navItems)[0]) => {
    setActiveTab(item.id);

    // Smooth scroll to section
    const element = document.querySelector(item.href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 md:hidden ${className}`}>
        <div className="bg-background/95 border-border border-t backdrop-blur-lg">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`relative flex min-w-[60px] flex-col items-center justify-center p-2 transition-all duration-200 ${
                  activeTab === item.id
                    ? 'text-holo-primary'
                    : 'text-muted-foreground hover:text-foreground'
                } ${item.isSpecial ? 'scale-110 transform' : ''}`}
                aria-label={item.label}
              >
                {/* Special scan button styling */}
                {item.isSpecial ? (
                  <div className="relative">
                    <div className="from-holo-primary to-holo-secondary absolute inset-0 rounded-full bg-gradient-to-r opacity-75 blur-sm" />
                    <div className="from-holo-primary to-holo-secondary relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r text-white shadow-lg">
                      {item.icon}
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className={`transition-all duration-200 ${activeTab === item.id ? 'scale-110' : ''}`}
                    >
                      {item.icon}
                    </div>
                    <span className="mt-1 text-xs font-medium">{item.label}</span>

                    {/* Active indicator */}
                    {activeTab === item.id && (
                      <div className="bg-holo-primary absolute -top-1 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full" />
                    )}
                  </>
                )}

                {/* Touch feedback ripple */}
                <div className="active:bg-holo-primary/10 absolute inset-0 rounded-full transition-all duration-200" />
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind nav */}
      <div className="h-16 md:hidden" />
    </>
  );
};

export default MobileBottomNav;
