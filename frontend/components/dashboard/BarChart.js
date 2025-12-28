'use client';

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getStatusBreakdown } from '../../lib/analytics';
import { useTranslations } from '../providers/IntlProvider';
import { CHART_COLORS, getChartTooltipConfig } from '../../lib/chart-utils';

/**
 * Bar Chart Component
 * Displays task counts by status
 */
export default function BarChart({ tasks = [] }) {
  const t = useTranslations('dashboard.charts');

  // Get status breakdown data
  const data = getStatusBreakdown(tasks);

  // Custom tooltip config
  const tooltipConfig = getChartTooltipConfig();

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">{t('taskBreakdown')}</h3>
        <div className="h-[300px] flex items-center justify-center text-white/60">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-4 text-white/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p>{t('noData')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Format status names for display (capitalize first letter)
  const formattedData = data.map((item) => ({
    ...item,
    status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
  }));

  return (
    <div className="glass-panel rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">{t('taskBreakdown')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          role="img"
          aria-label="Bar chart showing task counts by status"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="status"
            stroke="rgba(255, 255, 255, 0.5)"
            style={{ fontSize: '12px', fill: '#cbd5e1' }}
          />
          <YAxis
            stroke="rgba(255, 255, 255, 0.5)"
            style={{ fontSize: '12px', fill: '#cbd5e1' }}
            allowDecimals={false}
          />
          <Tooltip {...tooltipConfig} />
          <Bar
            dataKey="count"
            fill={CHART_COLORS.primary}
            radius={[8, 8, 0, 0]}
            maxBarSize={80}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
