'use client';

import { useIntl } from '../providers/IntlProvider';

/**
 * LanguageToggle Component
 *
 * Language toggle button for switching between English and Urdu.
 * Displays the opposite language of current locale.
 */
export default function LanguageToggle() {
  const { locale, setLocale } = useIntl();

  const handleClick = () => {
    const newLocale = locale === 'en' ? 'ur' : 'en';
    setLocale(newLocale);
  };

  // Display opposite language
  const displayText = locale === 'en' ? 'اردو' : 'English';
  const ariaLabel = locale === 'en' ? 'Switch to Urdu' : 'Switch to English';

  return (
    <div className="group relative">
      <button
        onClick={handleClick}
        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium text-white focus:ring-2 focus:ring-brand-400 focus:outline-none active:scale-95"
        aria-label={ariaLabel}
      >
        {displayText}
      </button>
      {/* Tooltip */}
      <span className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap border border-white/20 shadow-lg z-50 pointer-events-none">
        {ariaLabel}
        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900"></span>
      </span>
    </div>
  );
}
