/**
 * Elite Home/Landing page with Cinematic UI
 */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../lib/auth';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/todos');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <main className="max-w-7xl mx-auto w-full pt-20 pb-32">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-brand-400/30 text-brand-300 text-sm font-medium mb-8 animate-reveal" style={{ animationDelay: '0.1s' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Next-Gen AI Productivity
          </div>

          <h1 className="text-7xl md:text-9xl font-bold mb-8 animate-reveal tracking-tight leading-tight">
            Elevate Your <br />
            <span className="text-gradient-elite">Daily Workflow</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto animate-reveal leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Experience the fusion of elite task management and AI-driven precision.
            Crafted for those who demand world-class efficiency.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center animate-reveal" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/login"
              className="group relative px-10 py-5 bg-brand-500 text-black rounded-2xl transition-all duration-500 shadow-neon hover:shadow-neon-hover font-bold text-xl overflow-hidden btn-premium"
            >
              <span className="relative z-10 flex items-center gap-2">
                Begin Your Journey
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-500 group-hover:translate-x-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </Link>
            <Link
              href="/tour"
              className="px-10 py-5 glass-panel hover:bg-white/5 text-white rounded-2xl transition-all duration-500 font-bold text-xl backdrop-blur-3xl border-white/10 hover:border-white/20"
            >
              The Experience
            </Link>
          </div>
        </div>

        {/* Cinematic Feature Grid */}
        <div id="features" className="grid md:grid-cols-3 gap-10 px-4">
          {[
            {
              title: "AI Synchronicity",
              desc: "Intelligent task distribution that learns from your behavior to optimize focus periods.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              )
            },
            {
              title: "Glassmorphism UI",
              desc: "A stunning, distraction-free interface built on modern design principles for absolute clarity.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              )
            },
            {
              title: "Quantum Search",
              desc: "Instantaneous global search across your entire workspace with natural language understanding.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              )
            }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-10 rounded-[2.5rem] animate-reveal group" style={{ animationDelay: `${0.4 + (i * 0.1)}s` }}>
              <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mb-8 text-brand-400 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-black transition-all duration-500 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-lg">{feature.desc}</p>

              <div className="mt-8 pt-8 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-brand-400 font-semibold flex items-center gap-2 cursor-pointer hover:gap-3 transition-all">
                  Learn More <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
