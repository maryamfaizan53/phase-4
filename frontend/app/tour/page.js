/**
 * Modern Tour Page with Glassmorphism
 */
'use client';

import Link from 'next/link';

export default function TourPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>

      <main className="flex-grow container mx-auto px-4 py-20 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center text-brand-300 hover:text-white mb-8 transition-colors duration-300 group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight animate-slide-up">
            Discover a Better Way to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-purple-400">Work</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Take a deep dive into the features that make our Todo App the ultimate tool for personal and professional productivity.
          </p>
        </div>

        {/* Feature Section 1: Smart Dashboard */}
        <div className="flex flex-col md:flex-row items-center gap-16 mb-32 group">
          <div className="w-full md:w-1/2 animate-slide-up order-2 md:order-1" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500 blur-2xl opacity-20 rounded-full"></div>
              <div className="glass-panel p-8 rounded-3xl relative transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:-rotate-1">
                {/* Mock UI for Dashboard */}
                <div className="flex items-center justify-between mb-6">
                  <div className="h-4 w-32 bg-white/20 rounded-full"></div>
                  <div className="h-8 w-8 bg-brand-500 rounded-full"></div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                      <div className="h-5 w-5 rounded-full border-2 border-brand-400"></div>
                      <div className="flex-1">
                        <div className="h-3 w-3/4 bg-white/30 rounded-full mb-2"></div>
                        <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 animate-slide-up order-1 md:order-2" style={{ animationDelay: '0.3s' }}>
            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-brand-300 shadow-neon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Smart Dashboard</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Your central command center. Get a bird's-eye view of your tasks, filtered by status or priority. The intuitive layout ensures you never lose track of what's important, wrapped in a stunning glassmorphic interface that's a joy to use.
            </p>
          </div>
        </div>

        {/* Feature Section 2: Focus Mode */}
        <div className="flex flex-col md:flex-row items-center gap-16 mb-32 group">
          <div className="w-full md:w-1/2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-purple-300 shadow-neon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Unbroken Focus</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Distractions are the enemy of productivity. Our app is designed to help you enter a flow state. With clean typography, subtle animations, and zero clutter, you can focus entirely on the task at hand.
            </p>
          </div>
          <div className="w-full md:w-1/2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 rounded-full"></div>
              <div className="glass-panel p-8 rounded-3xl relative transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:rotate-1">
                 {/* Mock UI for Focus Task */}
                 <div className="text-center py-10">
                    <div className="h-20 w-20 mx-auto rounded-full border-4 border-purple-400/30 flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className="h-6 w-3/4 bg-white/90 rounded-full mx-auto mb-3"></div>
                    <div className="h-3 w-1/2 bg-white/40 rounded-full mx-auto"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="glass-panel max-w-3xl mx-auto p-12 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
                
                <h2 className="text-4xl font-bold text-white mb-6 relative z-10">Ready to boost your productivity?</h2>
                <p className="text-lg text-gray-200 mb-8 relative z-10">Join thousands of users who have transformed the way they work.</p>
                <Link
                href="/login"
                className="relative z-10 inline-block px-10 py-5 bg-brand-500 hover:bg-brand-400 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-brand-500/50 hover:-translate-y-1 font-bold text-lg"
                >
                Start for Free
                </Link>
            </div>
        </div>

      </main>
    </div>
  );
}
