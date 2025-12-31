'use client';

import dynamic from 'next/dynamic';
import { ChartSkeleton } from './SkeletonLoader';

// Lazy load chart components for better performance
const DonutChart = dynamic(() => import('./DonutChart'), {
  loading: () => <ChartSkeleton title />,
  ssr: false,
});

const LineChart = dynamic(() => import('./LineChart'), {
  loading: () => <ChartSkeleton title />,
  ssr: false,
});

const BarChart = dynamic(() => import('./BarChart'), {
  loading: () => <ChartSkeleton title />,
  ssr: false,
});

const PriorityDistributionChart = dynamic(() => import('./PriorityDistributionChart'), {
  loading: () => <ChartSkeleton title />,
  ssr: false,
});

/**
 * Task Charts Container Component
 * Displays all chart components in a responsive grid layout
 */
export default function TaskCharts({ tasks = [] }) {
  // Empty state
  if (!tasks || tasks.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-white/20 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto mb-4 text-white/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-white mb-2">No Chart Data</h3>
        <p className="text-white/60">
          Create some tasks to see visual insights and analytics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Row: Donut, Priority and Line Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
          <DonutChart tasks={tasks} />
        </div>

        {/* Priority Distribution Chart */}
        <div className="animate-slide-up" style={{ animationDelay: '50ms' }}>
          <PriorityDistributionChart tasks={tasks} />
        </div>

        {/* Line Chart */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <LineChart tasks={tasks} />
        </div>
      </div>

      {/* Bottom Row: Bar Chart (full width) */}
      <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <BarChart tasks={tasks} />
      </div>
    </div>
  );
}
