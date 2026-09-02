import { create } from "zustand";
import { toast } from "react-toastify";
import api from "../services/api";


export const useAuthStore = create((set) => ({
  // ==================== State ====================

  isLoggedIn: false,
  userData: null,
  isLoading: false,
  token: null,

  // ==================== set token ====================

  setToken: (token) => set({ token }),
  // ==================== Signup ====================

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
        console.log(data);
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

      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      if (data.success) {
        toast.success(data.message || "Logged in successfully");
        console.log(data);
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
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isLoading: false });
    }
  },
  // Send Reset OTP
  sendResetOtp: async (email) => {
    try {
      set({ isLoading: true });
      const { data } = await api.post("/auth/send-reset-otp", {
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
      const { data } = await api.post("/auth/reset-password", {
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

      toast.error(error.response?.data?.message || error.message);
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
