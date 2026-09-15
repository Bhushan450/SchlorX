import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Token Refresh State ─────────────────────────────────────────────

let isRefreshing = false;
let pendingRequests = [];

function flushPendingRequests(success, error = null) {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (success) {
      resolve();
    } else {
      reject(error);
    }
  });

  pendingRequests = [];
}

// ─── Response Interceptor ───────────────────────────────────────────

api.interceptors.response.use(
  // Successful response
  (response) => response,

  // Error response
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // ── Guard 1: Login failure should NOT trigger token refresh ──────
    const isLoginRequest = originalRequest.url?.includes('/auth/login');

    if (status === 401 && isLoginRequest) {
      const customError = {
        message:
          error.response?.data?.message ||
          'Invalid email or password',
        status: 401,
        data: error.response?.data,
      };

      return Promise.reject(customError);
    }

    // ── Guard 2: Never retry the same request twice ──────────────────
    if (originalRequest._retry) {
      const customError = {
        message:
          error.response?.data?.message ||
          'An unexpected error occurred',
        status: 401,
        data: error.response?.data,
      };

      return Promise.reject(customError);
    }

    // ── Only 401 errors should trigger token refresh ────────────────
    if (status === 401) {

      // Never refresh the refresh-token request itself
      if (originalRequest.url?.includes('/auth/refresh-tokens')) {
        window.dispatchEvent(
          new CustomEvent('auth:session-expired')
        );

        const customError = {
          message:
            error.response?.data?.message ||
            'Session expired. Please log in again.',
          status: 401,
          data: error.response?.data,
        };

        return Promise.reject(customError);
      }

      // Mark request so it cannot be retried twice
      originalRequest._retry = true;

      // ── Concurrent 401 handling ──────────────────────────────────
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({
            resolve: () => resolve(api(originalRequest)),
            reject,
          });
        });
      }

      // ── Start token refresh ───────────────────────────────────────
      isRefreshing = true;

      try {
        await api.post('/auth/refresh-tokens');

        // Refresh succeeded
        flushPendingRequests(true);

        // Retry original request
        return api(originalRequest);

      } catch (refreshError) {

        // Refresh failed
        flushPendingRequests(false, {
          message: 'Session expired. Please log in again.',
          status: 401,
          data: null,
        });

        // Tell AuthContext that session is actually expired
        window.dispatchEvent(
          new CustomEvent('auth:session-expired')
        );

        return Promise.reject({
          message: 'Session expired. Please log in again.',
          status: 401,
          data: null,
        });

      } finally {
        isRefreshing = false;
      }
    }

    // ── All non-401 errors ──────────────────────────────────────────
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(customError);
  }
);

export default api;