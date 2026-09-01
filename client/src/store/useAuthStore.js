import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const apiBase = `${backendUrl}`;

axios.defaults.withCredentials = true;
const ACCESS_TOKEN_COOKIE_KEY = "token";

const getCookieValue = (name) => {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

const setCookieValue = (name, value) => {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; SameSite=Strict${secure}`;
};

const removeCookieValue = (name) => {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Strict${secure}`;
};

// restore access token from cookie (if any) so axios has Authorization header on load
const storedToken = getCookieValue(ACCESS_TOKEN_COOKIE_KEY);
if (storedToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
}

export const useAuthStore = create((set) => ({
  // ==================== State ====================

  isLoggedIn: false,
  userData: null,
  isLoading: false,

  // ==================== Signup ====================

  signup: async (name, email, password, passwordConfirm) => {
    try {
      set({ isLoading: true });

      const res = await axios.post(`${apiBase}/auth/register`, {
        name,
        email,
        password,
        passwordConfirm,
      });

      const data = res.data;

      if (data.success) {
        toast.success(data.message || "Account created successfully");

        const payload = data.data || {};
        // server returns newUser under data.newUser
        set({
          isLoggedIn: true,
          userData: payload.newUser || payload.user || null,
        });

        // if server returned an access token, persist it in cookie and set Authorization header
        if (payload.token) {
          setCookieValue(ACCESS_TOKEN_COOKIE_KEY, payload.token);
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${payload.token}`;
        }
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

      const res = await axios.post(`${apiBase}/auth/login`, {
        email,
        password,
      });

      const data = res.data;

      if (data.success) {
        toast.success(data.message || "Logged in successfully");

        const payload = data.data || {};

        set({
          isLoggedIn: true,
          userData: payload.user || null,
        });

        // persist access token in cookie and set Authorization header for future requests
        if (payload.token) {
          setCookieValue(ACCESS_TOKEN_COOKIE_KEY, payload.token);
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${payload.token}`;
        }

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
      const res = await axios.post(`${apiBase}/auth/forgot-password`, {
        email,
      });

      return res.data;
    } finally {
      set({ isLoading: false });
    }
  },
  // Reset Password
  resetPassword: async (email, otp, newPassword) => {
    try {
      set({ isLoading: true });
      // server expects reset flow: verify OTP then reset using resetToken; client code sends email, otp, newPassword
      const res = await axios.post(`${apiBase}/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });

      return res.data;
    } finally {
      set({ isLoading: false });
    }
  },
  // ==================== Get User Data ====================

  getUserData: async () => {
    try {
      set({ isLoading: true });

      const res = await axios.get(`${apiBase}/user/data`);
      const data = res.data;

      if (data.success) {
        const payload = data.data || {};
        set({
          userData: payload.user || null,
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

      const res = await axios.post(`${apiBase}/auth/logout`);
      const data = res.data;

      if (data.success) {
        // clear stored cookie token and axios header
        removeCookieValue(ACCESS_TOKEN_COOKIE_KEY);
        delete axios.defaults.headers.common["Authorization"];

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
