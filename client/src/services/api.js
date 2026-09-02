import axios from 'axios';
import { useAuthStore } from '../store';


export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

// Helper function to handle queued requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
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

    // Detects both a standard 401 error or your custom missing token text message
    const isUnauthorized = error.response?.status === 401;
    const isMissingTokenMessage = error.response?.data?.message?.includes("Token is missing");

    if ((isUnauthorized || isMissingTokenMessage) && !originalRequest._retry) {
      
      // If a refresh request is already active, queue this request
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
        // Use standard axios to bypass interceptors and avoid infinite loops
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        ); 
        
        // Matches your backend structure: data.data.token
        const newAccessToken = response.data?.data?.token; 

        if (!newAccessToken) {
          throw new Error("Token payload missing from backend response");
        }

        // Commit the new token to Zustand store memory
        useAuthStore.getState().setToken(newAccessToken); 

        // Flush all suspended queued requests
        processQueue(null, newAccessToken);

        // Update the current failed request and re-execute it
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // If refresh fails, silently wipe authorization so the user is prompted to sign in
        useAuthStore.getState().clearAuth(); 
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;