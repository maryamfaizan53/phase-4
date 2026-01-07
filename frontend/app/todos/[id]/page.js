/**
 * Elite Edit Task Page with Cinematic UI
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute';
import { tasksAPI } from '../../../lib/api';
import Navbar from '../../../components/Navbar';
import TodoForm from '../../../components/TodoForm';

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id;

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && taskId) {
      fetchTask();
    }
  }, [user, taskId]);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const data = await tasksAPI.get(user.id, taskId);
      setTask(data);
    } catch (error) {
      console.error('Failed to fetch task:', error);
      router.push('/todos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await tasksAPI.update(user.id, taskId, data);
      router.push('/todos');
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/todos');
  };

  if (loading && !task) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="relative mb-8">
          <div className="h-20 w-20 rounded-full border-4 border-brand-500/10 border-t-brand-500 animate-spin shadow-neon"></div>
          <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-transparent border-b-purple-500 animate-spin" style={{ animationDuration: '1.5s' }}></div>
        </div>
        <p className="text-brand-400 font-bold uppercase tracking-[0.3em] text-sm animate-pulse">Syncing Objective...</p>
      </div>
    );
  }

  if (!task) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen relative overflow-hidden bg-black">
        <Navbar user={user} />

        <main className="container mx-auto px-6 py-12 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 animate-reveal">
              <div>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center text-brand-400 hover:text-white mb-8 transition-all duration-500 group font-bold uppercase tracking-[0.2em] text-xs"
                >
                  <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center mr-4 group-hover:bg-brand-500 group-hover:text-black transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </div>
                  Back to Hub
                </button>
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-brand-500/10 text-brand-400 font-bold text-xs uppercase tracking-[0.2em] mb-4 border border-brand-500/20">
                  Objective Modification
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                  Edit <span className="text-gradient-elite">Task</span>
                </h1>
              </div>
            </div>

            <div className="animate-reveal [animation-delay:100ms] pb-32">
              <TodoForm
                task={task}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={submitting}
              />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
