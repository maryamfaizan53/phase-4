/**
 * Elite List of todo items with Cinematic states
 */
'use client';

import TodoItem from './TodoItem';

export default function TodoList({ tasks, onToggleComplete, onDelete, onEdit, loading }) {
  if (loading) {
    return (
      <div className="text-center py-20 animate-reveal">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin"></div>
            <div className="absolute inset-0 h-16 w-16 rounded-full border-2 border-transparent border-b-brand-secondary animate-spin" style={{ animationDuration: '1.5s' }}></div>
          </div>
        </div>
        <p className="text-brand-300 font-bold text-xl tracking-tight">Accessing Neural Workspace...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 animate-reveal">
        <div className="mx-auto max-w-lg glass-panel rounded-[3rem] p-12 border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="flex justify-center mb-8 relative z-10">
            <div className="bg-brand-500/10 p-6 rounded-3xl shadow-neon group-hover:shadow-neon-hover transition-all duration-700">
              <svg
                className="h-20 w-20 text-brand-400 group-hover:scale-110 transition-transform duration-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-4xl font-bold text-white mb-4 tracking-tight relative z-10">Canvas Empty</h3>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 relative z-10">Initiate your first synchronization by adding a task to your neural workspace.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-reveal">
      {tasks.map((task, index) => (
        <div key={task.id} className="animate-reveal" style={{ animationDelay: `${index * 0.1}s` }}>
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
