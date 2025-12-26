/**
 * Modern Navigation bar component
 */
'use client';

import { logout } from '../lib/auth';

export default function Navbar({ user }) {
  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-2 sm:top-4 z-50 mx-2 sm:mx-4">
      <div className="glass-panel rounded-2xl shadow-glass border border-white/20 backdrop-blur-xl">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="bg-gradient-to-br from-brand-400 to-blue-500 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-brand-200 tracking-tight">Todo App</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-medium text-white truncate max-w-xs">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-white/10 hover:bg-red-500/20 text-white rounded-xl border border-white/10 hover:border-red-500/50 transition-all duration-300 font-semibold flex items-center space-x-1 sm:space-x-2 hover:shadow-neon text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Logout</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
