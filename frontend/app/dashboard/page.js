'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/auth/AuthProvider';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { tasksAPI } from '../../lib/api';
import Navbar from '../../components/Navbar';
import DashboardKPIs from '../../components/dashboard/DashboardKPIs';
import TaskCharts from '../../components/dashboard/TaskCharts';
import TaskTable from '../../components/dashboard/TaskTable';
import ChatWidget from '../../components/chat/ChatWidget';
import { KPISkeleton, ChartSkeleton, TableSkeleton } from '../../components/dashboard/SkeletonLoader';
import ErrorBoundary from '../../components/ErrorBoundary';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      if (tasks.length > 0) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const data = await tasksAPI.list(user.id);
      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Neural communication failure. Please re-synchronize.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      await tasksAPI.toggleComplete(user.id, taskId, completed);
      await fetchTasks();
    } catch (err) {
      console.error('Error toggling task:', err);
      setError(err.message || 'Task state mutation failed.');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await tasksAPI.delete(user.id, taskId);
      await fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message || 'Permanent erasure failed.');
    }
  };

  const handleEdit = (taskId) => {
    router.push(`/todos/${taskId}`);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen relative overflow-hidden">
        <Navbar user={user} />

        <main id="main-content" className="container mx-auto px-6 py-12 relative z-10 animate-reveal">
          {/* Elite Page Header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-brand-500/10 text-brand-400 font-bold text-xs uppercase tracking-[0.2em] mb-4 border border-brand-500/20">
              Insight Hub
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
              Command <span className="text-gradient-elite">Center</span>
            </h1>
            <p className="mt-4 text-xl text-gray-400 font-medium">
              Monitor your neural output and productivity trajectory.
            </p>
          </div>

          {error && (
            <div className="mb-12 glass-panel rounded-3xl p-6 border-red-500/30 bg-red-500/5 animate-pop-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-red-400 font-bold tracking-tight">{error}</span>
                </div>
                <button
                  onClick={fetchTasks}
                  className="px-6 py-2 bg-red-500 text-white rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg"
                >
                  Request Re-Sync
                </button>
              </div>
            </div>
          )}

          <div className="space-y-12 pb-32">
            <section id="kpi-section" className="animate-reveal [animation-delay:100ms]">
              <ErrorBoundary fallbackMessage="KPI Neural Link Interrupted.">
                {loading ? <KPISkeleton /> : <DashboardKPIs tasks={tasks} />}
              </ErrorBoundary>
            </section>

            <section id="charts-section" className="animate-reveal [animation-delay:200ms]">
              <ErrorBoundary fallbackMessage="Visualization Matrix Error.">
                {loading ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ChartSkeleton title />
                    <ChartSkeleton title />
                  </div>
                ) : (
                  <TaskCharts tasks={tasks} />
                )}
              </ErrorBoundary>
            </section>

            <section id="table-section" className="animate-reveal [animation-delay:300ms]">
              <ErrorBoundary fallbackMessage="Task Buffer Overflow.">
                {loading ? (
                  <TableSkeleton />
                ) : (
                  <TaskTable
                    tasks={tasks}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                )}
              </ErrorBoundary>
            </section>
          </div>
        </main>

        {user && (
          <ChatWidget userId={user.id} onTaskUpdate={fetchTasks} />
        )}
      </div>
    </ProtectedRoute>
  );
}
