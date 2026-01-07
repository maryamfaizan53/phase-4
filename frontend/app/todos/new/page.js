/**
 * Elite New Task Page with Cinematic UI
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute';
import { tasksAPI } from '../../../lib/api';
import Navbar from '../../../components/Navbar';
import TodoForm from '../../../components/TodoForm';

export default function NewTaskPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await tasksAPI.create(user.id, data);
      router.push('/todos');
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/todos');
  };

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
                  New Objective Initiation
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                  Create <span className="text-gradient-elite">Objective</span>
                </h1>
              </div>
            </div>

            <div className="animate-reveal [animation-delay:100ms] pb-32">
              <TodoForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={loading}
              />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
