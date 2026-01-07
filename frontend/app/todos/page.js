/**
 * Elite Todos Page with Cinematic UI
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/auth/AuthProvider';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { tasksAPI } from '../../lib/api';
import Navbar from '../../components/Navbar';
import TodoList from '../../components/TodoList';
import TodoFilters from '../../components/TodoFilters';
import Button from '../../components/ui/Button';
import ChatWidget from '../../components/chat/ChatWidget';

export default function TodosPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    completed: 'all',
    search: '',
    sort: 'created_at',
    order: 'desc'
  });

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, filters]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await tasksAPI.list(user.id, filters);
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      await tasksAPI.toggleComplete(user.id, taskId, completed);
      fetchTasks();
    } catch (error) {
      console.error('Failed to toggle completion:', error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await tasksAPI.delete(user.id, taskId);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleEdit = (taskId) => {
    router.push(`/todos/${taskId}`);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen relative overflow-hidden bg-black">
        <Navbar user={user} />

        <main className="container mx-auto px-6 py-12 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 animate-reveal">
              <div>
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-brand-500/10 text-brand-400 font-bold text-xs uppercase tracking-[0.2em] mb-4 border border-brand-500/20">
                  Mission Control
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
                  Neural <span className="text-gradient-elite">Nexus</span>
                </h1>
                <p className="text-xl text-gray-400 mt-6 font-medium max-w-xl">
                  Optimize your productivity through ultra-responsive task management.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push('/todos/new')}
                  className="shadow-neon hover:shadow-neon-hover py-6 px-10 text-xl"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Objective
                </Button>
              </div>
            </div>

            <div className="mb-12 animate-reveal [animation-delay:100ms]">
              <TodoFilters filters={filters} onFilterChange={setFilters} />
            </div>

            <div className="animate-reveal [animation-delay:200ms] pb-32">
              <TodoList
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
                onEdit={handleEdit}
                loading={loading}
              />
            </div>
          </div>
        </main>

        {/* Chat Widget */}
        <ChatWidget userId={user?.id} onTaskUpdate={fetchTasks} />
      </div>
    </ProtectedRoute>
  );
}
