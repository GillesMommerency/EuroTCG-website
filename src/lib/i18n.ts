// Supported locales
export const locales = ['en', 'fr', 'de', 'es', 'it', 'nl'] as const;
export type Locale = typeof locales[number];

// Default locale
export const defaultLocale: Locale = 'en';

// Locale configuration
export const localeConfig = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr',
    dateFormat: 'MM/dd/yyyy',
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dir: 'ltr',
    dateFormat: 'dd/MM/yyyy',
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr',
    dateFormat: 'dd.MM.yyyy',
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    dir: 'ltr',
    dateFormat: 'dd/MM/yyyy',
  },
  it: {
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    dir: 'ltr',
    dateFormat: 'dd/MM/yyyy',
  },
  nl: {
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    dir: 'ltr',
    dateFormat: 'dd-MM-yyyy',
  },
} as const;

/**
 * Get the locale from a URL pathname
 */
export function getLocaleFromUrl(url: URL): Locale {
  const pathname = url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  
  return defaultLocale;
}

/**
 * Remove locale prefix from pathname
 */
export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return '/' + segments.slice(1).join('/');
  }
  
  return pathname;
}

/**
 * Add locale prefix to pathname
 */
export function addLocaleToPathname(pathname: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return pathname;
  }
  
  const cleanPathname = removeLocaleFromPathname(pathname);
  return `/${locale}${cleanPathname}`;
}

/**
 * Get localized path
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return path;
  }
  
  return `/${locale}${path}`;
}

/**
 * Get all localized paths for a given path
 */
export function getAllLocalizedPaths(path: string): { locale: Locale; path: string }[] {
  return locales.map(locale => ({
    locale,
    path: getLocalizedPath(path, locale),
  }));
}

/**
 * Get browser locale preference
 */
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  
  const browserLang = navigator.language.toLowerCase();
  
  // Check for exact match
  for (const locale of locales) {
    if (browserLang === locale) {
      return locale;
    }
  }
  
  // Check for language match (e.g., 'en-US' -> 'en')
  const langCode = browserLang.split('-')[0];
  for (const locale of locales) {
    if (langCode === locale) {
      return locale;
    }
  }
  
  return defaultLocale;
}

/**
 * Format number according to locale
 */
export function formatNumber(
  number: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(number);
}

/**
 * Format currency according to locale
 */
export function formatCurrency(
  amount: number,
  locale: Locale,
  currency: string = 'EUR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format date according to locale
 */
export function formatDate(
  date: Date,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Format relative time according to locale
 */
export function formatRelativeTime(
  date: Date,
  locale: Locale,
  baseDate: Date = new Date()
): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const diffInMs = date.getTime() - baseDate.getTime();
  const diffInSeconds = Math.round(diffInMs / 1000);
  const diffInMinutes = Math.round(diffInSeconds / 60);
  const diffInHours = Math.round(diffInMinutes / 60);
  const diffInDays = Math.round(diffInHours / 24);
  const diffInWeeks = Math.round(diffInDays / 7);
  const diffInMonths = Math.round(diffInDays / 30);
  const diffInYears = Math.round(diffInDays / 365);
  
  if (Math.abs(diffInYears) >= 1) {
    return rtf.format(diffInYears, 'year');
  } else if (Math.abs(diffInMonths) >= 1) {
    return rtf.format(diffInMonths, 'month');
  } else if (Math.abs(diffInWeeks) >= 1) {
    return rtf.format(diffInWeeks, 'week');
  } else if (Math.abs(diffInDays) >= 1) {
    return rtf.format(diffInDays, 'day');
  } else if (Math.abs(diffInHours) >= 1) {
    return rtf.format(diffInHours, 'hour');
  } else if (Math.abs(diffInMinutes) >= 1) {
    return rtf.format(diffInMinutes, 'minute');
  } else {
    return rtf.format(diffInSeconds, 'second');
  }
}

/**
 * Check if locale is RTL
 */
export function isRTL(locale: Locale): boolean {
  return localeConfig[locale].dir === 'rtl';
}

/**
 * Get alternate language links for SEO
 */
export function getAlternateLinks(
  currentPath: string,
  currentLocale: Locale
): { href: string; hreflang: string }[] {
  const baseUrl = import.meta.env.SITE || 'https://eurotcg.com';
  const cleanPath = removeLocaleFromPathname(currentPath);
  
  return locales.map(locale => ({
    href: `${baseUrl}${getLocalizedPath(cleanPath, locale)}`,
    hreflang: locale === defaultLocale ? 'x-default' : locale,
  }));
}

/**
 * Validate locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}