/**
 * Elite Button Component with Cinematic Effects
 */
import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = ''
}) => {
  const baseClasses = 'font-bold rounded-2xl inline-flex items-center justify-center transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed uppercase tracking-[0.15em] text-xs relative overflow-hidden group';

  const variants = {
    primary: 'bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 text-black shadow-neon hover:shadow-neon-hover active:scale-95 border border-white/10',
    secondary: 'glass-panel text-white hover:bg-white/10 border border-white/5 active:scale-95',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:shadow-red-500/40 active:scale-95',
    outline: 'border-2 border-brand-500/40 text-brand-300 bg-transparent hover:bg-brand-500/10 active:scale-95',
    ghost: 'text-gray-400 hover:bg-white/5 hover:text-white active:scale-95'
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-8 py-3.5 text-xs',
    lg: 'px-10 py-5 text-sm'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Shimmer Effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default Button;