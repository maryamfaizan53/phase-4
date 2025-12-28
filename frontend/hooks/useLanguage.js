'use client';

import { useState, useEffect } from 'use

';
import { useRouter, usePathname } from 'next/navigation';

/**
 * useLanguage Hook
 *
 * Manages language preference (English/Urdu) with localStorage persistence.
 * Returns current locale, direction, and setLocale function.
 */
export function useLanguage() {
  const router = useRouter();
  const pathname = usePathname();

  // Initialize from localStorage or default to 'en'
  const [locale, setLocaleState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preferredLanguage');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.locale || 'en';
        } catch (error) {
          return 'en';
        }
      }
    }
    return 'en';
  });

  // Derive direction from locale
  const direction = locale === 'ur' ? 'rtl' : 'ltr';

  // Set locale and persist to localStorage
  const setLocale = (newLocale) => {
    if (newLocale !== 'en' && newLocale !== 'ur') {
      console.warn('Invalid locale. Must be "en" or "ur"');
      return;
    }

    // Update state
    setLocaleState(newLocale);

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      const preference = {
        locale: newLocale,
        direction: newLocale === 'ur' ? 'rtl' : 'ltr',
        lastUpdated: Date.now()
      };
      localStorage.setItem('preferredLanguage', JSON.stringify(preference));
    }

    // Update HTML dir attribute
    if (typeof document !== 'undefined') {
      document.documentElement.dir = newLocale === 'ur' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLocale;
    }

    // Navigate to new locale path (if using [locale] routing)
    // For now, we'll just reload to apply changes
    // In a full implementation, you'd use Next.js i18n routing
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  // Set HTML attributes on mount and when locale changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = direction;
      document.documentElement.lang = locale;
    }
  }, [locale, direction]);

  return {
    locale,
    direction,
    setLocale
  };
}
