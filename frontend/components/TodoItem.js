/**
 * Modern Individual todo item component
 */
'use client';

import Checkbox from './ui/Checkbox';

export default function TodoItem({ task, onToggleComplete, onDelete, onEdit }) {
  const handleCheckboxChange = (e) => {
    onToggleComplete(task.id, e.target.checked);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  const handleEdit = () => {
    onEdit(task.id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="glass-card rounded-2xl p-6 mb-4 transition-all duration-300 hover:shadow-glass-hover group border-l-4 border-brand-500 hover:border-l-8">
      <div className="flex items-start gap-4">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onChange={handleCheckboxChange}
        />
        <div className="flex-1 min-w-0">
          <h3
            className={`text-xl font-semibold break-words transition-all duration-300 ${
              task.completed ? 'line-through text-white/40' : 'text-white'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-2 text-base transition-all duration-300 ${
              task.completed ? 'text-white/30' : 'text-brand-100'
            }`}>
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap justify-between items-center mt-4 gap-3">
            <p className="text-xs text-brand-200/60 font-medium uppercase tracking-wider bg-white/5 px-2 py-1 rounded-lg">
              {formatDate(task.created_at)}
            </p>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleEdit}
                className="px-3 py-1.5 text-sm bg-white/10 hover:bg-brand-500/20 text-brand-200 hover:text-white rounded-lg transition-colors duration-200 flex items-center border border-white/5 hover:border-brand-500/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 text-sm bg-white/10 hover:bg-red-500/20 text-red-300 hover:text-white rounded-lg transition-colors duration-200 flex items-center border border-white/5 hover:border-red-500/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
