'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated } from '../../lib/auth';
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
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Authentication guard and initial data fetch
  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Get user from localStorage
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
  }, [router]);

  // Fetch tasks when user is set
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  /**
   * Fetch tasks from API
   * Reusable function for initial load and refresh operations
   */
  const fetchTasks = async () => {
    if (!user) return;

    try {
      // Use refreshing state if this is not the initial load
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
      setError(err.message || 'Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Toggle task completion status
   */
  const handleToggleComplete = async (taskId, completed) => {
    try {
      await tasksAPI.toggleComplete(user.id, taskId, completed);
      await fetchTasks(); // Refresh tasks after update
    } catch (err) {
      console.error('Error toggling task:', err);
      setError(err.message || 'Failed to update task. Please try again.');
    }
  };

  /**
   * Delete a task
   */
  const handleDelete = async (taskId) => {
    try {
      await tasksAPI.delete(user.id, taskId);
      await fetchTasks(); // Refresh tasks after deletion
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message || 'Failed to delete task. Please try again.');
    }
  };

  /**
   * Edit a task (navigate to edit page)
   */
  const handleEdit = (taskId) => {
    router.push(`/todos/${taskId}`);
  };

  // Show loading spinner during initial load
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-400"></div>
          <p className="mt-4 text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if no user (redirecting)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>

      <Navbar user={user} />

      <main id="main-content" className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-brand-200">
            Dashboard
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/60">
            Your productivity insights at a glance
          </p>
        </div>

        {/* Error Message with Retry */}
        {error && (
          <div className="mb-6 glass-panel rounded-xl p-4 border border-red-500/50 bg-red-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-400 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-400">{error}</span>
              </div>
              <button
                onClick={fetchTasks}
                className="ml-4 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded border border-red-500/50 transition-all text-sm font-medium whitespace-nowrap"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Layout Structure */}
        <div className="space-y-6 sm:space-y-8 pb-24 sm:pb-8">
          {/* KPI Cards Section */}
          <section id="kpi-section">
            <ErrorBoundary fallbackMessage="Failed to load KPI metrics. Please refresh the page.">
              {loading ? (
                <KPISkeleton />
              ) : (
                <DashboardKPIs tasks={tasks} />
              )}
            </ErrorBoundary>
          </section>

          {/* Charts Section */}
          <section id="charts-section">
            <ErrorBoundary fallbackMessage="Failed to load charts. Please refresh the page.">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ChartSkeleton title />
                  <ChartSkeleton title />
                </div>
              ) : (
                <TaskCharts tasks={tasks} />
              )}
            </ErrorBoundary>
          </section>

          {/* Task Table Section */}
          <section id="table-section">
            <ErrorBoundary fallbackMessage="Failed to load task table. Please refresh the page.">
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

      {/* Chat Widget - Fixed position, always visible */}
      {user && (
        <ChatWidget userId={user.id} onTaskUpdate={fetchTasks} />
      )}
    </div>
  );
}
