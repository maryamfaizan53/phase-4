/**
 * PrioritySelector Component
 * Dropdown selector for task priority with visual indicators
 */
"use client";

import { PRIORITY_LEVELS, PRIORITY_CONFIG, DEFAULT_PRIORITY } from '../../lib/constants/priorities';

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

export default function PrioritySelector({ value = DEFAULT_PRIORITY, onChange, disabled = false }) {
  const config = PRIORITY_CONFIG[value] || PRIORITY_CONFIG[DEFAULT_PRIORITY];

  return (
    <div>
      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
        Priority
      </label>
      <div className="relative">
        <select
          id="priority"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none bg-white"
        >
          {Object.values(PRIORITY_LEVELS).map((priority) => {
            const priorityConfig = PRIORITY_CONFIG[priority];
            return (
              <option key={priority} value={priority}>
                {priorityConfig.label}
              </option>
            );
          })}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-sm text-gray-600">Selected:</span>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bgColor} border ${config.borderColor}`}>
          <span className={config.textColor}>
            <PriorityIcon iconName={config.icon} className="w-4 h-4" />
          </span>
          <span className={`text-xs font-medium ${config.textColor}`}>
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
}
