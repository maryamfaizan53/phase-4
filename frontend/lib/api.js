/**
 * API client for communicating with FastAPI backend
 *
 * Handles:
 * - JWT token attachment
 * - Error handling
 * - Response parsing
 */

import { getToken, refreshAccessToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Make an API request with JWT authentication
 *
 * @param {string} endpoint - API endpoint (e.g., '/api/user-123/tasks')
 * @param {Object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<any>} Response data
 * @throws {Error} If request fails
 */
export async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  // Build headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Make request
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized - attempt refresh
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        // Retry original request with new token
        headers['Authorization'] = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers,
        });
        if (retryResponse.ok) return await retryResponse.json();
      }

      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    // Handle 403 Forbidden
    if (response.status === 403) {
      throw new Error('Access denied');
    }

    // Handle 404 Not Found
    if (response.status === 404) {
      throw new Error('Resource not found');
    }

    // Handle 422 Validation Error
    if (response.status === 422) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Validation error');
    }

    // Handle 204 No Content (successful DELETE)
    if (response.status === 204) {
      return null;
    }

    // Handle other error status codes
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    // Parse and return JSON response
    return await response.json();

  } catch (error) {
    // Re-throw error for caller to handle
    console.error('API request error:', error);
    throw error;
  }
}

/**
 * Task API methods
 */

export const tasksAPI = {
  /**
   * Get all tasks for a user
   * @param {string} userId
   * @param {Object} filters - Optional filters (completed, search, sort, order, priority)
   * @returns {Promise<Array>} List of tasks
   */
  list: async (userId, filters = {}) => {
    const params = new URLSearchParams();

    if (filters.completed !== undefined && filters.completed !== 'all') {
      params.append('completed', filters.completed);
    }
    if (filters.priority && filters.priority !== 'all') {
      params.append('priority', filters.priority);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.sort) {
      params.append('sort', filters.sort);
    }
    if (filters.order) {
      params.append('order', filters.order);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/api/${userId}/tasks${query}`);
  },

  /**
   * Get a single task
   * @param {string} userId
   * @param {string} taskId
   * @returns {Promise<Object>} Task object
   */
  get: async (userId, taskId) => {
    return apiRequest(`/api/${userId}/tasks/${taskId}`);
  },

  /**
   * Create a new task
   * @param {string} userId
   * @param {Object} taskData - { title, description, priority }
   * @returns {Promise<Object>} Created task
   */
  create: async (userId, taskData) => {
    return apiRequest(`/api/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Update a task
   * @param {string} userId
   * @param {string} taskId
   * @param {Object} taskData - { title, description, priority }
   * @returns {Promise<Object>} Updated task
   */
  update: async (userId, taskId, taskData) => {
    return apiRequest(`/api/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Delete a task
   * @param {string} userId
   * @param {string} taskId
   * @returns {Promise<null>}
   */
  delete: async (userId, taskId) => {
    return apiRequest(`/api/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Toggle task completion
   * @param {string} userId
   * @param {string} taskId
   * @param {boolean} completed
   * @returns {Promise<Object>} Updated task
   */
  toggleComplete: async (userId, taskId, completed) => {
    return apiRequest(`/api/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
  },
};

/**
 * Chat API methods
 */
export const chatAPI = {
  /**
   * Send message to chat endpoint
   * @param {string} userId - User ID
   * @param {string} message - User message
   * @returns {Promise<Object>} { response, conversation_id }
   */
  sendMessage: async (userId, message) => {
    return apiRequest(`/api/${userId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};
