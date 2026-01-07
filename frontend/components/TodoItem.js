/**
 * Elite Individual todo item component with Premium interactions
 */
'use client';

import Checkbox from './ui/Checkbox';

export default function TodoItem({ task, onToggleComplete, onDelete, onEdit }) {
  const handleCheckboxChange = (e) => {
    onToggleComplete(task.id, e.target.checked);
  };

  const handleDelete = () => {
    if (confirm('Permanently remove this task from neural storage?')) {
      onDelete(task.id);
    }
  };

  const handleEdit = () => {
    onEdit(task.id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`glass-card rounded-[2rem] p-8 transition-all duration-500 hover:shadow-premium group relative overflow-hidden ${task.completed ? 'opacity-60 grayscale-[0.5]' : ''
      }`}>
      {/* Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${task.completed ? 'from-gray-500/20 to-gray-500/20' : 'from-brand-500/10 to-brand-secondary/10'
        } blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200`}></div>

      <div className="relative flex items-start gap-6">
        <div className="pt-1">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onChange={handleCheckboxChange}
            className="w-6 h-6 border-brand-500/30 checked:bg-brand-500 transition-all duration-500"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-4">
            <h3
              className={`text-2xl font-bold break-words transition-all duration-500 tracking-tight ${task.completed ? 'line-through text-white/30' : 'text-white group-hover:text-brand-300'
                }`}
            >
              {task.title}
            </h3>

            <div className={`h-3 w-3 rounded-full mt-2.5 shadow-[0_0_12px_rgba(45,212,191,0.5)] ${task.completed ? 'bg-gray-500 shadow-none' : 'bg-brand-400 animate-pulse'
              }`}></div>
          </div>

          {task.description && (
            <p className={`mt-3 text-lg leading-relaxed transition-all duration-500 ${task.completed ? 'text-white/20' : 'text-gray-400 font-medium'
              }`}>
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap justify-between items-center mt-8 gap-4 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2">
              <p className="text-xs text-brand-400 bg-brand-500/5 px-3 py-1.5 rounded-full font-bold uppercase tracking-widest border border-brand-500/10">
                {formatDate(task.created_at)}
              </p>
              <span className={`text-[10px] font-black uppercase tracking-tighter ${task.completed ? 'text-gray-500' : 'text-brand-300'
                }`}>
                {task.completed ? 'Archived' : 'Active'}
              </span>
            </div>

            <div className="flex gap-3 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
              <button
                onClick={handleEdit}
                className="p-3 bg-white/5 hover:bg-brand-500 hover:text-black text-brand-300 rounded-xl transition-all duration-300 border border-white/5 group/btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="p-3 bg-white/5 hover:bg-red-500 hover:text-white text-red-400 rounded-xl transition-all duration-300 border border-white/5 group/btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
