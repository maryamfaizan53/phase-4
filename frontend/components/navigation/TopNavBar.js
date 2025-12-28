'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from '../providers/IntlProvider';
import LanguageToggle from './LanguageToggle';

/**
 * TopNavBar Component
 *
 * Top navigation bar for the dashboard with:
 * - Application logo
 * - Language toggle (placeholder, wired in Phase 5)
 * - User profile menu with logout
 *
 * @param {Object} user - Current user object with name/email
 */
export default function TopNavBar({ user }) {
  const router = useRouter();
  const t = useTranslations('navigation');

  const handleLogout = () => {
    // Clear authentication token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }

    // Redirect to login
    router.push('/login');
  };

  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  const navigateToTasks = () => {
    router.push('/todos');
  };

  return (
    <nav className="glass-panel border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Application Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{t('appName')}</h1>
              <p className="text-xs text-white/60">{t('appSubtitle')}</p>
            </div>
          </div>

          {/* Right Section: Navigation Links + Language Toggle + User Menu */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Navigation Links */}
            <div className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={navigateToDashboard}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all focus:ring-2 focus:ring-brand-400 focus:outline-none flex items-center space-x-2 rtl:space-x-reverse"
                aria-label={t('dashboard')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span className="text-white text-sm font-medium">{t('dashboard')}</span>
              </button>
              <button
                onClick={navigateToTasks}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all focus:ring-2 focus:ring-brand-400 focus:outline-none flex items-center space-x-2 rtl:space-x-reverse"
                aria-label={t('tasks')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="text-white text-sm font-medium">{t('tasks')}</span>
              </button>
            </div>
            {/* Language Toggle (fully functional in Phase 5) */}
            <LanguageToggle />

            {/* User Profile Menu */}
            <div className="relative group">
              <button
                className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all focus:ring-2 focus:ring-brand-400 focus:outline-none"
                aria-label={t('userMenu')}
                aria-haspopup="true"
                aria-expanded="false"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block text-left rtl:text-right">
                  <p className="text-sm font-medium text-white">
                    {user?.name || user?.email || 'User'}
                  </p>
                  <p className="text-xs text-white/60">{t('account')}</p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="glass-panel rounded-xl border border-white/20 shadow-xl">
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-left rtl:text-right focus:ring-2 focus:ring-brand-400 focus:outline-none"
                      aria-label={t('logout')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="text-white text-sm font-medium">{t('logout')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
