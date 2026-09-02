import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// =========================
// Request Interceptor
// =========================

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    // Make sure headers exist
    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// =========================
// Response Interceptor
// =========================

let isRefreshing = false;
let failedQueue = [];

// Helper function to process the queue when the refresh completes or fails
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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Catch BOTH 401 Unauthorized AND your backend's specific "missing token" response
    const isUnauthorized = error.response?.status === 401;
    const isMissingTokenMessage = error.response?.data?.message?.includes("Token is missing");

    if ((isUnauthorized || isMissingTokenMessage) && !originalRequest._retry) {
      
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
        // Try to get a fresh access token using the HTTP-only refresh cookie
        // Change '/auth/refresh' to your exact backend endpoint
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, {}, { withCredentials: true }); 
        
        const { accessToken } = response.data; 

        // Update Zustand store
        useAuthStore.getState().setToken(accessToken); 

        processQueue(null, accessToken);

        // Retry the original request with the brand new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Optional: clear store and send user to login if refresh cookie is expired/missing
        // useAuthStore.getState().clearAuth(); 
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;