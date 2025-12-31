/**
 * PriorityBadge Component
 * Displays task priority as a colored badge with icon and label
 */
"use client";

import { PRIORITY_CONFIG, DEFAULT_PRIORITY, getPriorityConfig } from '../../lib/constants/priorities';

const PriorityIcon = ({ iconName, className = '' }) => {
  const icons = {
    ChevronDown: (
      <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Minus: (
      <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    ChevronUp: (
      <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 10L8 6L12 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Flame: (
      <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2C6.5 4 6 5.5 6 7C6 9 7 10 8 10C9 10 10 9 10 7C10 5.5 9.5 4 8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 10C6 10 4.5 11.5 4.5 13C4.5 13.8 5.2 14.5 6 14.5H10C10.8 14.5 11.5 13.8 11.5 13C11.5 11.5 10 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };
  return icons[iconName] || null;
};

export default function PriorityBadge({ priority, size = 'md', showLabel = true, showIcon = true }) {
  const config = getPriorityConfig(priority);

  const sizeClasses = {
    sm: { container: 'px-2 py-1 text-xs gap-1', icon: 'w-3 h-3' },
    md: { container: 'px-3 py-1.5 text-sm gap-1.5', icon: 'w-4 h-4' },
    lg: { container: 'px-4 py-2 text-base gap-2', icon: 'w-5 h-5' }
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <span
      className={`inline-flex items-center justify-center ${currentSize.container} ${config.bgColor} ${config.textColor} ${config.borderColor} backdrop-blur-xl border rounded-lg font-medium transition-all duration-200`}
      role="status"
      aria-label={`Priority: ${config.label}`}
    >
      {showIcon && (
        <PriorityIcon iconName={config.icon} className={`${currentSize.icon} ${config.textColor}`} />
      )}
      {showLabel && <span className="leading-none">{config.label}</span>}
    </span>
  );
}
