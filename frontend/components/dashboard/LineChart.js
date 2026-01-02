'use client';

import { useMemo } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getTimeSeriesData } from '../../lib/analytics';
import { CHART_COLORS, getChartTooltipConfig } from '../../lib/chart-utils';

/**
 * Line Chart Component
 * Displays task creation and completion trends over the last 7 days
 */
export default function LineChart({ tasks = [] }) {
  // Memoize time series data to avoid recalculation on every render
  const data = useMemo(() => getTimeSeriesData(tasks, 7), [tasks]);

  // Custom tooltip config
  const tooltipConfig = getChartTooltipConfig();

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">
          Activity Trend (Last 7 Days)
        </h3>
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
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            <p>No activity data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">
        Activity Trend (Last 7 Days)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          role="img"
          aria-label="Task activity trend line chart for last 7 days"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="date"
            stroke="rgba(255, 255, 255, 0.5)"
            style={{ fontSize: '12px', fill: '#cbd5e1' }}
          />
          <YAxis
            stroke="rgba(255, 255, 255, 0.5)"
            style={{ fontSize: '12px', fill: '#cbd5e1' }}
            allowDecimals={false}
          />
          <Tooltip {...tooltipConfig} />
          <Legend
            wrapperStyle={{
              paddingTop: '10px',
              fontSize: '14px',
              color: '#e2e8f0',
            }}
            formatter={(value) => <span style={{ color: '#e2e8f0' }}>{value}</span>}
          />
          <Line
            type="monotone"
            dataKey="created"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="Created"
          />
          <Line
            type="monotone"
            dataKey="completed"
            stroke={CHART_COLORS.completed}
            strokeWidth={2}
            dot={{ fill: CHART_COLORS.completed, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="Completed"
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
