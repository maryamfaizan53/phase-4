/**
 * Priority System Constants
 * Defines the 4-level priority system for tasks with associated colors, icons, and labels
 */

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    color: '#10b981',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/30',
    icon: 'ChevronDown'
  },
  medium: {
    label: 'Medium',
    color: '#f59e0b',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    icon: 'Minus'
  },
  high: {
    label: 'High',
    color: '#f97316',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    icon: 'ChevronUp'
  },
  urgent: {
    label: 'Urgent',
    color: '#ef4444',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    icon: 'Flame'
  }
};

export const DEFAULT_PRIORITY = PRIORITY_LEVELS.MEDIUM;

export function getPriorityOptions() {
  return [
    { value: 'all', label: 'All Priorities' },
    { value: PRIORITY_LEVELS.LOW, label: PRIORITY_CONFIG.low.label },
    { value: PRIORITY_LEVELS.MEDIUM, label: PRIORITY_CONFIG.medium.label },
    { value: PRIORITY_LEVELS.HIGH, label: PRIORITY_CONFIG.high.label },
    { value: PRIORITY_LEVELS.URGENT, label: PRIORITY_CONFIG.urgent.label }
  ];
}

export function getPriorityConfig(priority) {
  return PRIORITY_CONFIG[priority] || PRIORITY_CONFIG[DEFAULT_PRIORITY];
}

export function isValidPriority(priority) {
  return Object.values(PRIORITY_LEVELS).includes(priority);
}
