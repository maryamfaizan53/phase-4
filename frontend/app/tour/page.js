/**
 * Elite Tour Page with Cinematic UI
 */
'use client';

import Link from 'next/link';

export default function TourPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">
      <main className="flex-grow container mx-auto px-6 py-24 relative z-10">

        {/* Elite Header */}
        <div className="text-center mb-32 max-w-5xl mx-auto animate-reveal">
          <Link href="/" className="inline-flex items-center text-brand-400 hover:text-white mb-12 transition-all duration-500 group font-bold uppercase tracking-[0.2em] text-xs">
            <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center mr-4 group-hover:bg-brand-500 group-hover:text-black transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            Back to Nexus
          </Link>

          <h1 className="text-6xl md:text-8xl font-black mb-8 text-white tracking-tighter leading-tight">
            The Future of <br />
            <span className="text-gradient-elite">Neural Workflow</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
            Experience the next generation of task management, where precision engineering meets cinematic design.
          </p>
        </div>

        {/* Feature Section 1: Neural Dashboard */}
        <div className="flex flex-col lg:flex-row items-center gap-24 mb-48 animate-reveal [animation-delay:200ms]">
          <div className="w-full lg:w-1/2 relative group">
            <div className="absolute -inset-4 bg-gradient-to-br from-brand-500/20 to-purple-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="glass-panel p-10 rounded-[3rem] relative border-white/5 shadow-premium transform transition-all duration-700 hover:scale-[1.03] hover:-rotate-1">
              {/* Animated Mock UI */}
              <div className="flex items-center justify-between mb-8">
                <div className="h-5 w-40 bg-white/10 rounded-full"></div>
                <div className="h-10 w-10 bg-brand-500 rounded-2xl animate-pulse"></div>
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center gap-6 group/item">
                    <div className="h-8 w-8 rounded-xl border-2 border-brand-500/30 group-hover/item:border-brand-500 transition-colors"></div>
                    <div className="flex-1">
                      <div className="h-4 w-3/4 bg-white/20 rounded-full mb-3"></div>
                      <div className="h-2 w-1/2 bg-white/5 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-brand-500/10 text-brand-400 font-bold text-xs uppercase tracking-widest mb-8 border border-brand-500/20">
              <span className="h-2 w-2 rounded-full bg-brand-500 animate-ping"></span>
              Core System
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Neural Dashboard</h2>
            <p className="text-gray-400 text-lg leading-relaxed font-medium mb-10">
              Your centralized command center for neural task processing. Advanced glassmorphism provides depth without distraction, while cinematic entry points ensure zero friction in your workflow.
            </p>
            <ul className="space-y-4">
              {['Dynamic KPI Monitoring', 'Intelligent Priority Sorting', 'Real-time Neural Sync'].map(item => (
                <li key={item} className="flex items-center text-white/80 font-bold gap-3">
                  <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA: Final Initialization */}
        <div className="text-center animate-reveal [animation-delay:400ms]">
          <div className="glass-panel max-w-4xl mx-auto p-16 md:p-24 rounded-[4rem] relative overflow-hidden border-white/5 shadow-premium group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-purple-500/10 opacity-50"></div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10 leading-tight">
              Ready to <br />
              <span className="text-gradient-elite">Initialize Nexus?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 relative z-10 font-medium max-w-2xl mx-auto">
              Join the elite circle of producers who have optimized their neural output through our secondary-tier task assistant.
            </p>
            <Link
              href="/login"
              className="relative z-10 px-12 py-6 bg-brand-500 text-black rounded-3xl font-black text-xl hover:scale-110 active:scale-95 transition-all duration-500 shadow-neon hover:shadow-neon-hover uppercase tracking-widest inline-block"
            >
              Authorize Link
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
