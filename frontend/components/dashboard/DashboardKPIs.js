'use client';

import { useMemo } from 'react';
import { calculateKPIs } from '../../lib/analytics';
import { useTranslations } from '../providers/IntlProvider';
import KPICard from './KPICard';

/**
 * Dashboard KPIs Component
 * Displays 4 KPI cards in a responsive grid with calculated metrics
 */
export default function DashboardKPIs({ tasks = [] }) {
  const t = useTranslations('dashboard.kpis');

  // Memoize KPI calculations to avoid recomputing on every render
  const kpis = useMemo(() => calculateKPIs(tasks), [tasks]);

  // Icon components
  const TasksIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    </svg>
  );

  const CheckIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const ClockIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  const AlertIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );

  // Memoize completion rate calculation
  const completionRate = useMemo(() =>
    kpis.totalTasks > 0
      ? Math.round((kpis.completedTasks / kpis.totalTasks) * 100)
      : 0,
    [kpis.totalTasks, kpis.completedTasks]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Tasks */}
      <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
        <KPICard
          title={t('total')}
          value={kpis.totalTasks}
          icon={<TasksIcon />}
          color="brand"
          trend={kpis.totalTasks > 0 ? `${completionRate}% ${t('complete')}` : t('noTasksYet')}
        />
      </div>

      {/* Completed Tasks */}
      <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
        <KPICard
          title={t('completed')}
          value={kpis.completedTasks}
          icon={<CheckIcon />}
          color="green"
          trend={
            kpis.completedTasks > 0
              ? `${kpis.completedTasks} ${t('of')} ${kpis.totalTasks} ${t('tasksCount')}`
              : t('noCompleted')
          }
        />
      </div>

      {/* Pending Tasks */}
      <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <KPICard
          title={t('pending')}
          value={kpis.pendingTasks}
          icon={<ClockIcon />}
          color="yellow"
          trend={
            kpis.pendingTasks > 0
              ? `${kpis.pendingTasks} ${t('tasksInProgress')}`
              : t('allComplete')
          }
        />
      </div>

      {/* Overdue Tasks */}
      <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
        <KPICard
          title={t('overdue')}
          value={kpis.overdueTasks}
          icon={<AlertIcon />}
          color="red"
          trend={
            kpis.overdueTasks > 0
              ? t('needsAttention')
              : t('noOverdue')
          }
        />
      </div>
    </div>
  );
}
