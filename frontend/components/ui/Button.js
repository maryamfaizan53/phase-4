/**
 * Modern Button Component
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
  const baseClasses = 'font-semibold rounded-xl inline-flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-brand-500 to-blue-600 text-white shadow-lg hover:shadow-neon hover:scale-[1.02] border border-transparent',
    secondary: 'glass-panel text-white hover:bg-white/10 border border-white/20',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02]',
    outline: 'border-2 border-brand-400 text-brand-300 bg-transparent hover:bg-brand-500/10',
    ghost: 'text-gray-300 hover:bg-white/10 hover:text-white'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg'
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
      {children}
    </button>
  );
};

export default Button;