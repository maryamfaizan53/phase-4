'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Translation context
const IntlContext = createContext({
  locale: 'en',
  messages: {},
  t: (key) => key,
  setLocale: () => {}
});

/**
 * IntlProvider Component
 *
 * Provides internationalization context to the entire app.
 * Loads translation files and provides t() function for translations.
 */
export function IntlProvider({ children }) {
  const [locale, setLocaleState] = useState('en');
  const [messages, setMessages] = useState({});

  // Load translations when locale changes
  useEffect(() => {
    async function loadMessages() {
      try {
        const response = await fetch(`/locales/${locale}.json`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error(`Failed to load translations for ${locale}:`, error);
        // Fallback to English
        if (locale !== 'en') {
          const fallback = await fetch('/locales/en.json');
          const data = await fallback.json();
          setMessages(data);
        }
      }
    }

    loadMessages();
  }, [locale]);

  // Load saved locale from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preferredLanguage');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.locale === 'en' || parsed.locale === 'ur') {
            setLocaleState(parsed.locale);
          }
        } catch (error) {
          console.error('Failed to parse saved language preference:', error);
        }
      }
    }
  }, []);

  // Set HTML attributes when locale changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ur' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  // Translation function
  const t = (key, defaultValue) => {
    const keys = key.split('.');
    let value = messages;

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return defaultValue || key;
      }
    }

    return value || defaultValue || key;
  };

  // Set locale function
  const setLocale = (newLocale) => {
    if (newLocale !== 'en' && newLocale !== 'ur') {
      console.warn('Invalid locale. Must be "en" or "ur"');
      return;
    }

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
  };

  const value = {
    locale,
    messages,
    t,
    setLocale,
    direction: locale === 'ur' ? 'rtl' : 'ltr'
  };

  return (
    <IntlContext.Provider value={value}>
      {children}
    </IntlContext.Provider>
  );
}

/**
 * useTranslations Hook
 *
 * Hook to access translation function in components.
 * Compatible with next-intl API for easier migration.
 */
export function useTranslations(namespace) {
  const { t } = useContext(IntlContext);

  return (key) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return t(fullKey);
  };
}

/**
 * useIntl Hook
 *
 * Hook to access full intl context (locale, setLocale, direction).
 */
export function useIntl() {
  return useContext(IntlContext);
}
