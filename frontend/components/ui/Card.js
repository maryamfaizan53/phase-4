/**
 * Modern Card Component with Glassmorphism
 */
import React from 'react';

const Card = ({ children, className = '', header, footer }) => {
  return (
    <div className={`glass-card rounded-xl overflow-hidden ${className}`}>
      {header && (
        <div className="px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
          {header}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;