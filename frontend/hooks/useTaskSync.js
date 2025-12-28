/**
 * useTaskSync Hook
 *
 * React hook for real-time task synchronization with optimistic updates.
 * Manages polling, optimistic updates, and error handling.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { tasksAPI } from '../lib/api';
import {
  startPolling,
  stopPolling,
  setPollingActive,
  optimisticAdd,
  optimisticUpdate,
  optimisticDelete,
  rollbackAdd,
  rollbackUpdate,
  rollbackDelete,
} from '../lib/sync-manager';

/**
 * Hook for syncing tasks with real-time updates
 * @param {string} userId - User ID to fetch tasks for
 * @param {boolean} isChatActive - Whether chat is currently active (affects polling interval)
 * @returns {Object} { tasks, loading, error, lastFetch, addTask, updateTask, deleteTask, refreshTasks }
 */
export default function useTaskSync(userId, isChatActive = false) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Use ref to track if component is mounted
  const isMounted = useRef(true);

  // Callback for sync manager to update tasks
  const handleTasksUpdate = useCallback((updatedTasks) => {
    if (isMounted.current) {
      setTasks(updatedTasks);
      setLoading(false);
      setLastFetch(new Date());
    }
  }, []);

  // Start/stop polling on mount/unmount
  useEffect(() => {
    isMounted.current = true;

    if (userId) {
      startPolling(userId, handleTasksUpdate, isChatActive);
    }

    return () => {
      isMounted.current = false;
      stopPolling();
    };
  }, [userId, handleTasksUpdate, isChatActive]);

  // Update polling interval when chat activity changes
  useEffect(() => {
    setPollingActive(isChatActive);
  }, [isChatActive]);

  /**
   * Add a new task (with optimistic update)
   * @param {Object} taskData - { title, description }
   * @returns {Promise<Object>} Created task
   */
  const addTask = useCallback(async (taskData) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticTask = {
      id: tempId,
      title: taskData.title,
      description: taskData.description || '',
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      // Optimistic update
      optimisticAdd(optimisticTask);

      // API call
      const createdTask = await tasksAPI.create(userId, taskData);

      // Remove optimistic task and add real one
      rollbackAdd(tempId);
      return createdTask;

    } catch (err) {
      // Rollback optimistic update
      rollbackAdd(tempId);
      setError(err.message || 'Failed to create task');
      throw err;
    }
  }, [userId]);

  /**
   * Update a task (with optimistic update)
   * @param {string} taskId - Task ID
   * @param {Object} updates - Updates to apply (e.g., { completed: true })
   * @returns {Promise<Object>} Updated task
   */
  const updateTask = useCallback(async (taskId, updates) => {
    try {
      // Optimistic update
      optimisticUpdate(taskId, updates);

      // API call
      const updatedTask = await tasksAPI.update(userId, taskId, updates);

      // Clear optimistic update (API response is source of truth)
      rollbackUpdate(taskId);
      return updatedTask;

    } catch (err) {
      // Rollback optimistic update
      rollbackUpdate(taskId);
      setError(err.message || 'Failed to update task');
      throw err;
    }
  }, [userId]);

  /**
   * Toggle task completion (with optimistic update)
   * @param {string} taskId - Task ID
   * @param {boolean} completed - New completion status
   * @returns {Promise<Object>} Updated task
   */
  const toggleComplete = useCallback(async (taskId, completed) => {
    try {
      // Optimistic update
      optimisticUpdate(taskId, { completed });

      // API call
      const updatedTask = await tasksAPI.toggleComplete(userId, taskId, completed);

      // Clear optimistic update
      rollbackUpdate(taskId);
      return updatedTask;

    } catch (err) {
      // Rollback optimistic update
      rollbackUpdate(taskId);
      setError(err.message || 'Failed to toggle task');
      throw err;
    }
  }, [userId]);

  /**
   * Delete a task (with optimistic update)
   * @param {string} taskId - Task ID
   * @returns {Promise<void>}
   */
  const deleteTask = useCallback(async (taskId) => {
    try {
      // Optimistic update
      optimisticDelete(taskId);

      // API call
      await tasksAPI.delete(userId, taskId);

      // Clear optimistic update (task confirmed deleted)
      rollbackDelete(taskId);

    } catch (err) {
      // Rollback optimistic update
      rollbackDelete(taskId);
      setError(err.message || 'Failed to delete task');
      throw err;
    }
  }, [userId]);

  /**
   * Manually refresh tasks (force re-fetch)
   * @returns {Promise<void>}
   */
  const refreshTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedTasks = await tasksAPI.list(userId);
      setTasks(fetchedTasks);
      setLastFetch(new Date());
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
      setLoading(false);
      throw err;
    }
  }, [userId]);

  return {
    tasks,
    loading,
    error,
    lastFetch,
    addTask,
    updateTask,
    toggleComplete,
    deleteTask,
    refreshTasks,
  };
}
