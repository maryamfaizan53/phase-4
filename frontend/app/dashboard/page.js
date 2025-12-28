'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated } from '../../lib/auth';
import { useTranslations } from '../../components/providers/IntlProvider';
import TopNavBar from '../../components/navigation/TopNavBar';
import DashboardKPIs from '../../components/dashboard/DashboardKPIs';
import TaskCharts from '../../components/dashboard/TaskCharts';
import TaskTable from '../../components/dashboard/TaskTable';
import ChatWidget from '../../components/chat/ChatWidget';
import AddTaskModal from '../../components/dashboard/AddTaskModal';
import { KPISkeleton, ChartSkeleton, TableSkeleton } from '../../components/dashboard/SkeletonLoader';
import ErrorBoundary from '../../components/ErrorBoundary';
import useTaskSync from '../../hooks/useTaskSync';
import { tasksAPI } from '../../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const tErrors = useTranslations('errors');
  const tAddTask = useTranslations('dashboard.addTask');
  const [user, setUser] = useState(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  // Chat activity tracking for dynamic polling intervals
  const [isChatActive, setIsChatActive] = useState(false);
  const chatActivityTimer = useRef(null);

  // Real-time task sync with dynamic polling based on chat activity
  const { tasks, loading, error, toggleComplete, deleteTask, refreshTasks } = useTaskSync(
    user?.id || null,
    isChatActive
  );

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

  /**
   * Mark chat as active and reset inactivity timer
   * Chat is considered active for 10 seconds after last interaction
   */
  const markChatActive = useCallback(() => {
    // Clear existing timer
    if (chatActivityTimer.current) {
      clearTimeout(chatActivityTimer.current);
    }

    // Set chat as active
    setIsChatActive(true);

    // Set timer to mark as inactive after 10 seconds
    chatActivityTimer.current = setTimeout(() => {
      setIsChatActive(false);
    }, 10000); // 10 seconds
  }, []);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (chatActivityTimer.current) {
        clearTimeout(chatActivityTimer.current);
      }
    };
  }, []);

  /**
   * Toggle task completion status (uses optimistic updates)
   */
  const handleToggleComplete = async (taskId, completed) => {
    try {
      await toggleComplete(taskId, completed);
    } catch (err) {
      console.error('Error toggling task:', err);
      // Error is already handled by useTaskSync, just log it
    }
  };

  /**
   * Delete a task (uses optimistic updates)
   */
  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (err) {
      console.error('Error deleting task:', err);
      // Error is already handled by useTaskSync, just log it
    }
  };

  /**
   * Handle chat task update (called when chat performs task operations)
   */
  const handleChatTaskUpdate = useCallback(() => {
    // Mark chat as active (triggers fast polling)
    markChatActive();
    // Trigger manual refresh to sync immediately
    refreshTasks();
  }, [markChatActive, refreshTasks]);

  /**
   * Edit a task (navigate to edit page)
   */
  const handleEdit = (taskId) => {
    router.push(`/todos/${taskId}`);
  };

  /**
   * Create a new task
   */
  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.create(user.id, taskData);
      // Refresh tasks after creation
      refreshTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      throw err; // Re-throw to let modal handle error display
    }
  };

  // Show loading spinner during initial load
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-400"></div>
          <p className="mt-4 text-white/70">{tCommon('loading')}</p>
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
        {tCommon('skipToMain')}
      </a>

      <TopNavBar user={user} />

      {/* Two-zone layout: Main dashboard area + Chat sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_384px] min-h-[calc(100vh-80px)]">
        {/* Main Dashboard Area (left/center) */}
        <main id="main-content" className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 overflow-y-auto">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-brand-200">
              {t('title')}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-white/60">
              {t('subtitle')}
            </p>
          </div>
          <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-brand-500/50 font-medium focus:outline-none focus:ring-2 focus:ring-brand-400 hover:-translate-y-0.5"
            aria-label={tAddTask('addButton')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>{tAddTask('addButton')}</span>
          </button>
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
                onClick={refreshTasks}
                className="ml-4 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded border border-red-500/50 transition-all text-sm font-medium whitespace-nowrap"
              >
                {tCommon('retry')}
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Layout Structure */}
        <div className="space-y-6 sm:space-y-8 pb-24 sm:pb-8">
          {/* KPI Cards Section */}
          <section id="kpi-section">
            <ErrorBoundary fallbackMessage={tErrors('loadKPIsFailed')}>
              {loading ? (
                <KPISkeleton />
              ) : (
                <DashboardKPIs tasks={tasks} />
              )}
            </ErrorBoundary>
          </section>

          {/* Charts Section */}
          <section id="charts-section">
            <ErrorBoundary fallbackMessage={tErrors('loadChartsFailed')}>
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
            <ErrorBoundary fallbackMessage={tErrors('loadTableFailed')}>
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

        {/* Chat Sidebar (right) - Hidden on mobile, visible on desktop */}
        <aside className="hidden lg:block border-l border-white/10 overflow-y-auto">
          {user && (
            <ChatWidget userId={user.id} onTaskUpdate={handleChatTaskUpdate} />
          )}
        </aside>
      </div>

      {/* Mobile Chat Widget - Shows as FAB/Modal on mobile (< lg breakpoint) */}
      <div className="lg:hidden">
        {user && (
          <ChatWidget userId={user.id} onTaskUpdate={handleChatTaskUpdate} mobile />
        )}
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}
