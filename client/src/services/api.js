import axios from 'axios';
import { useAuthStore } from '../store';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Requests to these endpoints should never trigger a refresh attempt on 401.
// (login/register: a 401 means bad credentials, not an expired token)
// (logout/refresh: it makes no sense for either to try refreshing itself)
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/logout', '/auth/refresh'];

let isRefreshing = false;
let failedQueue = [];

// Set after logout to stop any "orphaned" request from a still-mounted
// component from triggering a refresh after the user has actually logged out.
let isLoggedOut = false;
export const setLoggedOut = (value) => {
  isLoggedOut = value;
};

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ==========================================
// Request Interceptor (Attaches Token)
// ==========================================
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ==========================================
// Response Interceptor (Handles Token Rotation)
// ==========================================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = AUTH_ENDPOINTS.some((url) =>
      originalRequest?.url?.includes(url),
    );

    const isUnauthorized = error.response?.status === 401;
    const isMissingTokenMessage = error.response?.data?.message?.includes('Token is missing');

    // If the original request was itself an auth endpoint, or the user is
    // already logged out, let the error through without attempting a refresh.
    if (isAuthEndpoint || isLoggedOut) {
      return Promise.reject(error);
    }

    if ((isUnauthorized || isMissingTokenMessage) && !originalRequest._retry) {
      // If a refresh is already in flight, queue this request and wait for it.
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Plain axios (not api) to bypass interceptors and avoid an infinite loop
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = response.data?.data?.token;

        if (!newAccessToken) {
          throw new Error('Token payload missing from backend response');
        }

        useAuthStore.getState().setToken(newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        useAuthStore.getState().clearAuth();

        // Reject with the original request's error, not the refresh error,
        // so the caller sees the real message for the request it made.
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;