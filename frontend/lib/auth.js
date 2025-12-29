/**
 * Simplified authentication utility
 *
 * NOTE: This is a simplified implementation for demonstration.
 * In production, use Better Auth library for full authentication features.
 *
 * This module provides basic auth functions that work with JWT tokens.
 */

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

/**
 * Get current authenticated user from localStorage
 * @returns {Object|null} User object or null if not authenticated
 */
export function getUser() {
  if (typeof window === 'undefined') return null;

  const userStr = localStorage.getItem(AUTH_USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Get JWT token from localStorage
 * @returns {string|null} JWT token or null
 */
export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Set user and token in localStorage
 * @param {Object} user - User object with id and email
 * @param {string} token - JWT token
 */
export function setAuth(user, token) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Clear authentication data
 */
export function clearAuth() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

/**
 * Simple HS256 JWT signing for demo purposes
 * NOTE: This is a TEMPORARY implementation. In production, use Better Auth.
 */
async function createJWT(payload, secret) {
  // JWT Header
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  // Base64URL encode
  const base64UrlEncode = (obj) => {
    return btoa(JSON.stringify(obj))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);

  // Create signature using Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(`${encodedHeader}.${encodedPayload}`);
  const keyData = encoder.encode(secret);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Login function
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} User object
 */
export async function login(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Login failed');
  }

  const data = await response.json();
  const user = {
    id: data.user_id,
    email: data.email,
    name: data.full_name || data.email.split('@')[0]
  };

  setAuth(user, data.access_token);
  // Also store refresh token
  localStorage.setItem('refresh_token', data.refresh_token);

  return user;
}

/**
 * Signup function
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @returns {Promise<Object>} User object
 */
export async function signup(email, password, name) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, full_name: name }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Signup failed');
  }

  const data = await response.json();
  const user = {
    id: data.user_id,
    email: data.email,
    name: data.full_name || data.email.split('@')[0]
  };

  setAuth(user, data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);

  return user;
}

/**
 * Refresh access token
 * @returns {Promise<string|null>} New access token
 */
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      clearAuth();
      localStorage.removeItem('refresh_token');
      return null;
    }

    const data = await response.json();
    const user = {
      id: data.user_id,
      email: data.email,
      name: data.full_name || data.email.split('@')[0]
    };

    setAuth(user, data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    return data.access_token;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return null;
  }
}

/**
 * Logout function
 */
export async function logout() {
  const token = getToken();
  if (token) {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
    } catch (e) {
      console.error('Logout API call failed', e);
    }
  }

  clearAuth();
  localStorage.removeItem('refresh_token');
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!getToken() && !!getUser();
}
