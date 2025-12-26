/**
 * Modern Home/Landing page with Glassmorphism
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Ambience is handled by globals.css body, but we can add floating orbs here if needed */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-brand-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

      <main className="max-w-6xl mx-auto w-full z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-6 animate-float">
            <div className="glass-panel p-6 rounded-3xl shadow-neon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-slide-up tracking-tight text-white drop-shadow-lg">
            Organize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-blue-400">Life</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            A simple, elegant, and powerful task manager designed to help you focus on what matters most. 
            <span className="block mt-2 text-gray-300 text-lg">Streamline your day with style and precision.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/login"
              className="group relative px-8 py-4 bg-brand-500 hover:bg-brand-400 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-brand-500/50 hover:-translate-y-1 font-semibold text-lg overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </Link>
            <Link
              href="/tour"
              className="px-8 py-4 glass-panel hover:bg-white/10 text-white rounded-2xl transition-all duration-300 hover:-translate-y-1 font-semibold text-lg backdrop-blur-md"
            >
              Take a Tour
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div id="features" className="grid md:grid-cols-3 gap-8 mt-20 px-4">
          {[
            {
              title: "Effortless Organization",
              desc: "Capture ideas and tasks in seconds. Categorize and prioritize with intuitive ease.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              )
            },
            {
              title: "Focus & Clarity",
              desc: "A distraction-free interface that helps you concentrate on your most important goals.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              )
            },
            {
              title: "Track Progress",
              desc: "Visualize your productivity with smart insights and a satisfying completion workflow.",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              )
            }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 rounded-3xl animate-slide-up group" style={{ animationDelay: `${0.3 + (i * 0.1)}s` }}>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-brand-300 group-hover:scale-110 group-hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
