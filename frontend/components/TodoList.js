/**
 * Modern List of todo items
 */
'use client';

import TodoItem from './TodoItem';

export default function TodoList({ tasks, onToggleComplete, onDelete, onEdit, loading }) {
  if (loading) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading your tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="mx-auto max-w-md glass-panel rounded-3xl p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-5 rounded-full shadow-neon">
              <svg
                className="h-16 w-16 text-brand-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No tasks yet!</h3>
          <p className="text-gray-300 mb-6">Create your first task to get started on your journey to productivity.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {tasks.map((task, index) => (
        <div key={task.id} className={`animate-slide-up`} style={{ animationDelay: `${index * 0.05}s` }}>
          <TodoItem
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      ))}
    </div>
  );
}
