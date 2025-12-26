'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getStatusDistribution } from '../../lib/analytics';
import { CHART_COLORS, getChartTooltipConfig } from '../../lib/chart-utils';

/**
 * Donut Chart Component
 * Displays task status distribution as a donut chart
 */
export default function DonutChart({ tasks = [] }) {
  // Memoize status distribution data to avoid recalculation
  const data = useMemo(() => getStatusDistribution(tasks), [tasks]);

  // Map status names to colors
  const getColor = (name) => {
    if (name === 'Pending') return CHART_COLORS.pending;
    if (name === 'Completed') return CHART_COLORS.completed;
    return CHART_COLORS.primary;
  };

  // Custom tooltip config
  const tooltipConfig = getChartTooltipConfig();

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Status Distribution</h3>
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
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
            <p>No data to display</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart role="img" aria-label="Task status distribution donut chart">
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={{
              stroke: 'rgba(255, 255, 255, 0.3)',
              strokeWidth: 1,
            }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColor(entry.name)}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip {...tooltipConfig} />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '14px',
              color: '#e2e8f0',
            }}
            iconType="circle"
            formatter={(value) => <span style={{ color: '#e2e8f0' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
