import { create } from "zustand";
import { toast } from "react-toastify";
import api from "../services/api";
import axios from "axios";

export const useAuthStore = create((set) => ({
  // ==================== State ====================
  isLoggedIn: false,
  userData: null,
  isLoading: false,
  token: null,
  // ==================== set token ====================
  setToken: (token) => set({ token }),
    // Reset helper invoked when authentication sessions expire completely
  clearAuth: () => set({ isLoggedIn: false, token: null, userData: null }),
  // ==================== Signup ====================
 // Cold start initialization action triggered on page refresh
  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`, 
        {}, 
        { withCredentials: true }
      );

      // Matches your backend structure: data.data.token
      if (data?.success && data?.data?.token) { 
        set({
          isLoggedIn: true,
          token: data.data.token,
          userData: data.data.user || null, // Ensure your backend includes user models if desired
        });
      }
    } catch (error) {
      console.log(error);
      // Refresh token cookie is missing or invalid, fail silently without error UI
      set({ isLoggedIn: false, token: null, userData: null });
    } finally {
      set({ isLoading: false });
    }
  },
  signup: async (name, email, password, passwordConfirm) => {
    try {
      set({ isLoading: true });

      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
        passwordConfirm,
      });

      if (data.success) {
        toast.success(data.message || "Account created successfully");
        set({
          isLoggedIn: true,
          userData: data.userData || null,
        });
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    } finally {
      set({ isLoading: false });
    }
  },

  // ==================== Login ====================

  login: async (email, password) => {
    try {
      set({ isLoading: true });

      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      if (data.success) {
        toast.success(data.message || "Logged in successfully");
       // Set the token in axios headers
        set({
          isLoggedIn: true,
          userData: data.data.user || null,
          token: data.data.token || null,
        });
        return data.success;
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    } finally {
      set({ isLoading: false });
    }
  },
 // Send Reset OTP
  sendResetOtp: async (email) => {
    try {
      set({ isLoading: true });
      const { data } = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      return data;
    } finally {
      set({ isLoading: false });
    }
  },
  // Verify OTP
  verifyOtp: async (email, otp) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const { data } = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      set({
        isLoading: false,
        error: null,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Invalid or expired OTP",
      });

      throw error;
    }
  },
  // Reset Password
  resetPassword: async (resetToken, password, passwordConfirm) => {
    try {
      set({ isLoading: true });

      const { data } = await api.post("/auth/reset-password", {
        resetToken,
        password,
        passwordConfirm,
      });

      return data;
    } finally {
      set({ isLoading: false });
    }
  },
  // ==================== Get User Data ====================

  getUserData: async () => {
    try {
      set({ isLoading: true });

      const { data } = await api.get("/api/user/data");

      if (data.success) {
        set({
          userData: data.userData,
          isLoggedIn: true,
        });
      } else {
        set({
          userData: null,
          isLoggedIn: false,
        });
      }
    } catch (error) {
      set({
        userData: null,
        isLoggedIn: false,
      });

      toast.error(
        error.response?.data?.message || error.message
      );
    } finally {
      set({ isLoading: false });
    }
  },

  // ==================== Logout ====================

  logout: async () => {
    try {
      set({ isLoading: true });

      const { data } = await api.post("/auth/logout");

      if (data.success) {
        set({
          isLoggedIn: false,
          userData: null,
        });

        toast.success(
          data.message || "Logged out successfully"
        );
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    } finally {
      set({ isLoading: false });
    }
  },
}));