/**
 * Modern Checkbox Component
 */
import React from 'react';

const Checkbox = ({ 
  checked, 
  onChange, 
  id, 
  label,
  disabled = false 
}) => {
  return (
    <div className="flex items-center group">
      <div className="relative flex items-center justify-center p-0.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer appearance-none w-6 h-6 border-2 border-white/30 rounded-full checked:border-brand-400 checked:bg-gradient-to-tr checked:from-brand-500 checked:to-brand-400 focus:ring-2 focus:ring-brand-400/50 focus:ring-offset-0 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <svg 
          className="absolute w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200 transform scale-50 peer-checked:scale-100" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      {label && (
        <label htmlFor={id} className="ml-3 block text-sm text-white/90 group-hover:text-white cursor-pointer select-none transition-colors duration-200 font-medium">
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;