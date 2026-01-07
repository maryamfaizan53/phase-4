/**
 * Elite Navigation Bar with Cinematic Transitions
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '../lib/auth';

export default function Navbar({ user }) {
  const pathname = usePathname();

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-4 sm:top-6 z-50 mx-4 sm:mx-8">
      <div className="glass-panel rounded-[2rem] shadow-premium border-white/10 backdrop-blur-2xl px-6 py-4 flex justify-between items-center group relative overflow-hidden">
        {/* Shimmer Effect for the whole bar */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-500/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>

        <div className="flex items-center space-x-12 relative z-10">
          <Link href="/todos" className="flex items-center space-x-4 group/logo cursor-pointer">
            <div className="bg-gradient-to-br from-brand-400 to-brand-600 p-3 rounded-2xl shadow-neon group-hover/logo:scale-110 group-hover/logo:rotate-3 transition-all duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white group-hover/logo:text-brand-300 transition-colors">
              <span className="text-gradient-elite">Nexus</span> Todo
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-2">
            {[
              { label: 'Tasks', path: '/todos', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
              { label: 'Intelligence', path: '/dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
            ].map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-6 py-2.5 rounded-2xl font-bold uppercase tracking-[0.15em] text-[10px] transition-all duration-500 flex items-center gap-3 ${isActive(link.path)
                    ? 'bg-brand-500 text-black shadow-neon border border-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                </svg>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <div className="hidden xl:flex items-center space-x-3 bg-white/5 px-6 py-2.5 rounded-2xl border border-white/5 hover:border-brand-500/20 transition-all duration-500 group/user">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 group-hover/user:bg-brand-500 group-hover/user:text-black transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{user.email}</span>
          </div>

          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-white hover:text-white rounded-2xl border border-red-500/30 transition-all duration-500 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 shadow-lg hover:shadow-red-500/40 relative overflow-hidden group/logout"
          >
            <span className="relative z-10">Disconnect</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <div className="absolute inset-0 bg-red-500 -translate-x-full group-hover/logout:translate-x-0 transition-transform duration-500"></div>
          </button>
        </div>
      </div>
    </nav>
  );
}
