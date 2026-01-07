/**
 * Elite Card Component with Cinematic Glassmorphism
 */
import React from 'react';

const Card = ({ children, className = '', header, footer }) => {
  return (
    <div className={`glass-panel rounded-[2rem] overflow-hidden border-white/5 shadow-premium group relative ${className}`}>
      {/* Dynamic Glow Layer */}
      <div className="absolute inset-0 bg-brand-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

      {header && (
        <div className="px-8 py-6 border-b border-white/5 bg-white/2 backdrop-blur-md relative z-10">
          <div className="font-bold text-sm uppercase tracking-[0.2em] text-brand-300">
            {header}
          </div>
        </div>
      )}

      <div className="p-8 relative z-10">
        {children}
      </div>

      {footer && (
        <div className="px-8 py-6 border-t border-white/5 bg-white/2 backdrop-blur-md relative z-10">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;