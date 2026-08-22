/**
 * File: src/store/useAuthStore.js
 * Description: Global Zustand state management store handling user authentication status, user profile data, session loading states, and backend network operations.
 * 
 * Steps:
 * 1. Creates Zustand store holding state variables: backendUrl, isLoggedIn, userData, and isLoading.
 * 2. Exposes synchronous setters: setIsLoggedIn, setUserData, setIsLoading.
 * 3. getUserData makes authenticated GET request to /api/user/data and synchronizes userData and isLoggedIn in global state.
 * 4. logout triggers POST request to /api/auth/logout, resets store state, and provides user feedback toast.
 * 5. Exports useAuthStore hook.
 */

import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

export const useAuthStore = create((set, get) => ({
  backendUrl: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  isLoggedIn: false,
  userData: null,
  isLoading: false,

  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setUserData: (userData) => set({ userData }),
  setIsLoading: (isLoading) => set({ isLoading }),

  getUserData: async () => {
    try {
      set({ isLoading: true });
      const { backendUrl } = get();
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.success) {
        set({ userData: data.userData, isLoggedIn: true });
      } else {
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      const { backendUrl } = get();
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        set({ isLoggedIn: false, userData: null });
        toast.success(data.message || "Logged out successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  },
}));
