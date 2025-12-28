/**
 * Sync Manager for Real-Time Task Synchronization
 *
 * Provides polling-based sync with dynamic intervals and optimistic updates.
 * - Active polling: 500ms (when chat is active)
 * - Idle polling: 5s (when chat is inactive)
 * - Optimistic updates: Immediate UI update with rollback on error
 */

import { tasksAPI } from './api';

// Polling state
let pollingInterval = null;
let currentUserId = null;
let currentCallback = null;
let isActive = false;

// Optimistic update queue
const optimisticQueue = {
  adds: new Map(), // taskId -> task object
  updates: new Map(), // taskId -> updates object
  deletes: new Set(), // taskId set
};

// Retry state for exponential backoff
let retryCount = 0;
let retryTimeout = null;
const MAX_RETRIES = 5;
const BASE_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 30000; // 30 seconds

// Polling intervals
const ACTIVE_INTERVAL = 500; // 500ms when chat is active
const IDLE_INTERVAL = 5000; // 5s when chat is idle

/**
 * Start polling for task updates
 * @param {string} userId - User ID to fetch tasks for
 * @param {Function} onTasksUpdate - Callback when tasks are fetched (receives tasks array)
 * @param {boolean} active - Whether chat is currently active (affects polling interval)
 */
export function startPolling(userId, onTasksUpdate, active = false) {
  // Stop any existing polling
  stopPolling();

  // Store state
  currentUserId = userId;
  currentCallback = onTasksUpdate;
  isActive = active;

  // Start polling
  const interval = active ? ACTIVE_INTERVAL : IDLE_INTERVAL;
  pollingInterval = setInterval(async () => {
    try {
      await fetchAndUpdate();
    } catch (error) {
      console.error('Polling error:', error);
    }
  }, interval);

  // Initial fetch
  fetchAndUpdate();
}

/**
 * Stop polling
 */
export function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
  if (retryTimeout) {
    clearTimeout(retryTimeout);
    retryTimeout = null;
  }
  currentUserId = null;
  currentCallback = null;
  isActive = false;
  retryCount = 0; // Reset retry count
}

/**
 * Update polling interval based on chat activity
 * @param {boolean} active - Whether chat is currently active
 */
export function setPollingActive(active) {
  if (isActive === active) return; // No change

  isActive = active;

  // Restart polling with new interval if currently polling
  if (pollingInterval && currentUserId && currentCallback) {
    startPolling(currentUserId, currentCallback, active);
  }
}

/**
 * Fetch tasks and apply optimistic updates (with retry logic)
 */
async function fetchAndUpdate() {
  if (!currentUserId || !currentCallback) return;

  try {
    // Fetch tasks from API
    const tasks = await tasksAPI.list(currentUserId);

    // Apply optimistic updates
    const updatedTasks = applyOptimisticUpdates(tasks);

    // Call callback with updated tasks
    currentCallback(updatedTasks);

    // Reset retry count on success
    retryCount = 0;

  } catch (error) {
    console.error('Failed to fetch tasks:', error);

    // Implement exponential backoff retry
    if (retryCount < MAX_RETRIES) {
      retryCount++;

      // Calculate delay: 1s, 2s, 4s, 8s, 16s (max 30s)
      const delay = Math.min(
        BASE_RETRY_DELAY * Math.pow(2, retryCount - 1),
        MAX_RETRY_DELAY
      );

      console.log(`Retrying in ${delay}ms (attempt ${retryCount}/${MAX_RETRIES})`);

      // Clear existing retry timeout
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }

      // Schedule retry
      retryTimeout = setTimeout(() => {
        fetchAndUpdate();
      }, delay);
    } else {
      console.error(`Max retries (${MAX_RETRIES}) exceeded. Stopping retries.`);
      // Don't throw - let polling continue normally
    }
  }
}

/**
 * Apply optimistic updates to fetched tasks
 * @param {Array} tasks - Tasks from API
 * @returns {Array} Tasks with optimistic updates applied
 */
function applyOptimisticUpdates(tasks) {
  let result = [...tasks];

  // Apply optimistic adds (tasks not yet in API response)
  optimisticQueue.adds.forEach((task, taskId) => {
    const exists = result.find(t => t.id === taskId);
    if (!exists) {
      result.unshift(task); // Add to beginning
    } else {
      // Task now exists in API, remove from optimistic queue
      optimisticQueue.adds.delete(taskId);
    }
  });

  // Apply optimistic updates
  result = result.map(task => {
    if (optimisticQueue.updates.has(task.id)) {
      return { ...task, ...optimisticQueue.updates.get(task.id) };
    }
    return task;
  });

  // Apply optimistic deletes (filter out deleted tasks)
  result = result.filter(task => !optimisticQueue.deletes.has(task.id));

  // Clean up deletes if task no longer in API
  optimisticQueue.deletes.forEach(taskId => {
    const exists = tasks.find(t => t.id === taskId);
    if (!exists) {
      optimisticQueue.deletes.delete(taskId); // Task confirmed deleted
    }
  });

  return result;
}

/**
 * Optimistically add a task
 * @param {Object} task - Task object with id, title, description, completed, created_at
 */
export function optimisticAdd(task) {
  optimisticQueue.adds.set(task.id, task);
  triggerUpdate();
}

/**
 * Optimistically update a task
 * @param {string} taskId - Task ID
 * @param {Object} updates - Updates to apply (e.g., { completed: true })
 */
export function optimisticUpdate(taskId, updates) {
  // Merge with existing optimistic updates
  const existing = optimisticQueue.updates.get(taskId) || {};
  optimisticQueue.updates.set(taskId, { ...existing, ...updates });
  triggerUpdate();
}

/**
 * Optimistically delete a task
 * @param {string} taskId - Task ID
 */
export function optimisticDelete(taskId) {
  optimisticQueue.deletes.add(taskId);
  triggerUpdate();
}

/**
 * Rollback optimistic add (on API error)
 * @param {string} taskId - Task ID
 */
export function rollbackAdd(taskId) {
  optimisticQueue.adds.delete(taskId);
  triggerUpdate();
}

/**
 * Rollback optimistic update (on API error)
 * @param {string} taskId - Task ID
 */
export function rollbackUpdate(taskId) {
  optimisticQueue.updates.delete(taskId);
  triggerUpdate();
}

/**
 * Rollback optimistic delete (on API error)
 * @param {string} taskId - Task ID
 */
export function rollbackDelete(taskId) {
  optimisticQueue.deletes.delete(taskId);
  triggerUpdate();
}

/**
 * Clear all optimistic updates
 */
export function clearOptimisticUpdates() {
  optimisticQueue.adds.clear();
  optimisticQueue.updates.clear();
  optimisticQueue.deletes.clear();
  triggerUpdate();
}

/**
 * Trigger an immediate update (re-fetch and apply optimistic updates)
 */
function triggerUpdate() {
  if (currentUserId && currentCallback) {
    fetchAndUpdate().catch(error => {
      console.error('Failed to trigger update:', error);
    });
  }
}

/**
 * Get current optimistic queue state (for debugging)
 * @returns {Object} Current optimistic queue
 */
export function getOptimisticQueue() {
  return {
    adds: Array.from(optimisticQueue.adds.entries()),
    updates: Array.from(optimisticQueue.updates.entries()),
    deletes: Array.from(optimisticQueue.deletes),
  };
}
