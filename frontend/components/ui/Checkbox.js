/**
 * Elite Checkbox Component with Cinematic States
 */
import React from 'react';

const Checkbox = ({
  checked,
  onChange,
  id,
  label,
  disabled = false,
  className = ""
}) => {
  return (
    <div className={`flex items-center group ${className}`}>
      <div className="relative flex items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer appearance-none w-7 h-7 border-2 border-white/10 rounded-2xl checked:border-brand-400 bg-black/40 backdrop-blur-xl focus:ring-2 focus:ring-brand-500/30 transition-all duration-500 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-500/50"
        />

        {/* Elite Pulse Effect */}
        <div className="absolute inset-0 rounded-2xl bg-brand-500/20 scale-0 peer-checked:animate-pulse transition-transform duration-500 pointer-events-none"></div>

        <svg
          className="absolute w-4 h-4 text-black pointer-events-none opacity-0 peer-checked:opacity-100 transition-all duration-500 transform scale-50 peer-checked:scale-100 stroke-[4px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>

        {/* Checked Background Layer */}
        <div className="absolute inset-0.5 rounded-[0.9rem] bg-gradient-to-br from-brand-300 to-brand-600 opacity-0 peer-checked:opacity-100 transition-all duration-500 -z-10"></div>
      </div>

      {label && (
        <label htmlFor={id} className="ml-4 block text-base text-gray-400 group-hover:text-white cursor-pointer select-none transition-all duration-300 font-bold uppercase tracking-widest text-[10px] peer-checked:text-brand-300">
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;