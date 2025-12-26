/**
 * Modern Create new task page
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated } from '../../../lib/auth';
import { tasksAPI } from '../../../lib/api';
import Navbar from '../../../components/Navbar';
import TodoForm from '../../../components/TodoForm';

export default function NewTaskPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const currentUser = getUser();
    setUser(currentUser);
  }, [router]);

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
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8 pt-8 animate-slide-up">
            <button
              onClick={handleCancel}
              className="flex items-center text-brand-200 hover:text-white mr-4 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold text-white tracking-tight">Create New Task</h1>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <TodoForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
