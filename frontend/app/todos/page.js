/**
 * Modern Todo list page (main page)
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated } from '../../lib/auth';
import { tasksAPI } from '../../lib/api';
import Navbar from '../../components/Navbar';
import TodoList from '../../components/TodoList';
import TodoFilters from '../../components/TodoFilters';
import Button from '../../components/ui/Button';

export default function TodosPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    completed: 'all',
    search: '',
    sort: 'created_at',
    order: 'desc'
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const currentUser = getUser();
    setUser(currentUser);
  }, [router]);

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
      alert('Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await tasksAPI.delete(user.id, taskId);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task');
    }
  };

  const handleEdit = (taskId) => {
    router.push(`/todos/${taskId}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pt-8">
            <div className="animate-slide-up">
              <h1 className="text-4xl font-bold text-white tracking-tight text-shadow-sm">My Tasks</h1>
              <p className="text-brand-100 mt-2 font-medium">Manage your tasks and boost your productivity</p>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <Button
                variant="primary"
                onClick={() => router.push('/todos/new')}
                className="flex items-center shadow-neon hover:shadow-neon-hover"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Task
              </Button>
            </div>
          </div>

          <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <TodoFilters filters={filters} onFilterChange={setFilters} />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
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
    </div>
  );
}
