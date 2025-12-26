/**
 * Chart color palette matching brand and Tailwind theme
 */
export const CHART_COLORS = {
  pending: '#fbbf24',   // yellow-400
  completed: '#34d399', // green-400
  overdue: '#f87171',   // red-400
  primary: '#14b8a6',   // brand-500 (teal)
  secondary: '#5eead4', // brand-300 (light teal)
};

/**
 * Format numbers for chart labels
 * - < 1000: Return as-is
 * - ≥ 1000: Format as "1K", "1.5K", etc.
 * - ≥ 1000000: Format as "1M", "1.5M", etc.
 * @param {number} value - Number to format
 * @returns {string|number} Formatted number
 */
export function formatChartNumber(value) {
  if (typeof value !== 'number') {
    return value;
  }

  if (value < 1000) {
    return value;
  }

  if (value >= 1000000) {
    const millions = value / 1000000;
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
  }

  const thousands = value / 1000;
  return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
}

/**
 * Get Recharts tooltip configuration with glassmorphism styling
 * @returns {Object} Recharts tooltip config object
 */
export function getChartTooltipConfig() {
  return {
    contentStyle: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)', // slate-900 with opacity
      border: '1px solid rgba(148, 163, 184, 0.3)', // slate-400 with opacity
      borderRadius: '0.5rem',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      padding: '0.75rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    itemStyle: {
      color: '#e2e8f0', // slate-200
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    labelStyle: {
      color: '#cbd5e1', // slate-300
      fontSize: '0.875rem',
      fontWeight: '600',
      marginBottom: '0.25rem',
    },
    cursor: {
      fill: 'rgba(100, 116, 139, 0.1)', // slate-500 with low opacity
    },
  };
}

/**
 * Get default chart margin configuration
 * @returns {Object} Margin object for Recharts
 */
export function getDefaultChartMargin() {
  return {
    top: 20,
    right: 30,
    left: 20,
    bottom: 20,
  };
}
