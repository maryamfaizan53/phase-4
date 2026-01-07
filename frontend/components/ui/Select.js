/**
 * Elite Select Component with Glassmorphism
 */
import React from 'react';

const Select = ({
  label,
  id,
  value,
  onChange,
  options,
  error,
  placeholder,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-bold text-gray-400 mb-2 ml-1 uppercase tracking-[0.15em] text-[10px]">
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`w-full px-5 py-4 glass-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 appearance-none bg-black/40 backdrop-blur-xl transition-all duration-500 text-white font-medium border-white/5 hover:border-brand-500/30 ${error
              ? 'border-red-500/50 focus:ring-red-500/20'
              : 'border-white/10'
            } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="bg-[#0a0f1d] text-gray-500">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#0a0f1d] text-white">
              {option.label}
            </option>
          ))}
        </select>

        {/* Elite Dropdown Arrow */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-brand-400 group-hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-2 text-[10px] text-red-500 font-black uppercase tracking-widest animate-fade-in ml-1">{error}</p>}
    </div>
  );
};

export default Select;