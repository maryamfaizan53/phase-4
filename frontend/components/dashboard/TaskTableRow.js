'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '../../lib/date-helpers';

/**
 * Task Table Row Component
 * Displays a single task row in the task table
 */
export default function TaskTableRow({ task, onToggleComplete, onDelete, onEdit }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Keyboard navigation for delete confirmation
  useEffect(() => {
    if (showDeleteConfirm) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          handleDeleteCancel();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showDeleteConfirm]);

  const handleCheckboxChange = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onToggleComplete(task.id, task.status !== 'completed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await onDelete(task.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      setIsProcessing(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const handleEditClick = () => {
    onEdit(task.id);
  };

  const isCompleted = task.status === 'completed';

  return (
    <>
      <tr
        className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
        role="row"
      >
        {/* Checkbox Column */}
        <td className="px-4 py-4">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleCheckboxChange}
            disabled={isProcessing}
            className="w-5 h-5 rounded border-2 border-white/30 bg-white/10 checked:bg-brand-500 checked:border-brand-500 focus:ring-2 focus:ring-brand-400 focus:ring-offset-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label={`Mark task "${task.title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
          />
        </td>

        {/* Title Column */}
        <td className="px-4 py-4">
          <div
            className={`text-white font-medium ${isCompleted ? 'line-through opacity-60' : ''}`}
          >
            {task.title}
          </div>
          {task.description && (
            <div className="text-sm text-white/60 mt-1 line-clamp-1">
              {task.description}
            </div>
          )}
        </td>

        {/* Status Badge Column */}
        <td className="px-4 py-4">
          <span
            className={`
              inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
              ${
                isCompleted
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
              }
            `}
          >
            {isCompleted ? 'Completed' : 'Pending'}
          </span>
        </td>

        {/* Created Date Column */}
        <td className="px-4 py-4 text-white/70 text-sm">
          {formatDate(task.created_at)}
        </td>

        {/* Actions Column */}
        <td className="px-4 py-4">
          <div className="flex items-center space-x-2">
            {/* Edit Button */}
            <button
              onClick={handleEditClick}
              disabled={isProcessing}
              className="p-2 hover:bg-blue-500/20 rounded-lg border border-transparent hover:border-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Edit task "${task.title}"`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDeleteClick}
              disabled={isProcessing}
              className="p-2 hover:bg-red-500/20 rounded-lg border border-transparent hover:border-red-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Delete task "${task.title}"`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </td>
      </tr>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <tr>
          <td colSpan="5" className="px-4 py-0">
            <div
              className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 my-2"
              role="alert"
              aria-live="assertive"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">Delete Task?</h4>
                  <p className="text-white/70 text-sm">
                    Are you sure you want to delete "{task.title}"? This action cannot be undone.
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={handleDeleteCancel}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all duration-200 text-sm font-medium disabled:opacity-50"
                    aria-label="Cancel deletion"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/50 transition-all duration-200 text-sm font-medium disabled:opacity-50"
                    aria-label="Confirm deletion"
                  >
                    {isProcessing ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
