'use client';

import { memo } from 'react';

/**
 * KPI Card Component
 * Displays a single key performance indicator with icon, value, and optional trend
 */
const KPICard = memo(function KPICard({ title, value, icon, color = 'brand', trend }) {
  // Color variant mappings
  const colorVariants = {
    brand: {
      bg: 'from-brand-500/20 to-brand-600/10',
      border: 'border-brand-500/50',
      iconBg: 'bg-brand-500/20',
      iconColor: 'text-brand-400',
      valueColor: 'text-white',
      trendColor: 'text-brand-300',
    },
    green: {
      bg: 'from-green-500/20 to-green-600/10',
      border: 'border-green-500/50',
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400',
      valueColor: 'text-white',
      trendColor: 'text-green-300',
    },
    yellow: {
      bg: 'from-yellow-500/20 to-yellow-600/10',
      border: 'border-yellow-500/50',
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
      valueColor: 'text-white',
      trendColor: 'text-yellow-300',
    },
    red: {
      bg: 'from-red-500/20 to-red-600/10',
      border: 'border-red-500/50',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      valueColor: 'text-white',
      trendColor: 'text-red-300',
    },
  };

  const variant = colorVariants[color] || colorVariants.brand;

  return (
    <div
      className={`
        glass-panel rounded-xl p-6 border backdrop-blur-xl
        bg-gradient-to-br ${variant.bg} ${variant.border}
        hover:shadow-lg hover:scale-[1.02]
        transition-all duration-300
      `}
      role="article"
      aria-label={`${title} metric card`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title */}
          <h3 className="text-sm font-medium text-white/70 mb-3">
            {title}
          </h3>

          {/* Value */}
          <div className={`text-3xl font-bold ${variant.valueColor} mb-2`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>

          {/* Trend (optional) */}
          {trend && (
            <p className={`text-xs font-medium ${variant.trendColor}`}>
              {trend}
            </p>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <div
            className={`
              ${variant.iconBg} ${variant.iconColor}
              p-3 rounded-xl
              flex items-center justify-center
            `}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
});

export default KPICard;
