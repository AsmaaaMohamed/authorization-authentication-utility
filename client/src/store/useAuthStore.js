import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  // ==================== State ====================

  isLoggedIn: false,
  userData: null,
  isLoading: false,

  // ==================== Signup ====================

  signup: async (name, email, password, passwordConfirm) => {
    try {
      set({ isLoading: true });

      const { data } = await axios.post(`${backendUrl}/auth/register`, {
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
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  // ==================== Login ====================

  login: async (email, password) => {
    try {
      set({ isLoading: true });

      const { data } = await axios.post(`${backendUrl}/auth/login`, {
        email,
        password,
      });

      if (data.success) {
        toast.success(data.message || "Logged in successfully");

        set({
          isLoggedIn: true,
          userData: data.userData || null,
        });
        return true;
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  // Send Reset OTP
  sendResetOtp: async (email) => {
    try {
      set({ isLoading: true });
      const { data } = await axios.post(`${backendUrl}/auth/send-reset-otp`, {
        email,
      });

      return data;
    } finally {
      set({ isLoading: false });
    }
  },
  // Reset Password
  resetPassword: async (email, otp, newPassword) => {
    try {
      set({ isLoading: true });
      const { data } = await axios.post(`${backendUrl}/auth/reset-password`, {
        email,
        otp,
        newPassword,
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

      const { data } = await axios.get(`${backendUrl}/api/v1/user/data`);

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

      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  // ==================== Logout ====================

  logout: async () => {
    try {
      set({ isLoading: true });

      const { data } = await axios.post(`${backendUrl}/auth/logout`);

      if (data.success) {
        set({
          isLoggedIn: false,
          userData: null,
        });

        toast.success(data.message || "Logged out successfully");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));
