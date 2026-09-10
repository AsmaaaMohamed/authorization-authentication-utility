import axios from "axios";
import { toast } from "react-toastify";
import api from "../services/api";
import { useAuthStore } from "./useAuthStore";
import { useWorkspaceStore } from "./";

/**
 * Auth actions
 *
 * These are the only places that combine API calls with auth store
 * updates. store.js stays free of any api.js import, which avoids a
 * circular dependency (api.js already imports useAuthStore for its
 * interceptors).
 *
 * Each action toggles its own loading flag (isLoggingIn, isSigningUp, ...)
 * instead of a single shared isLoading, so a component like the login
 * button only reacts to the loading state of the action it actually
 * triggers - not to unrelated background calls like initializeAuth.
 */

// Cold start initialization action triggered on page refresh
export const initializeAuth = async () => {
  const { setLoadingState, setLoggedIn, clearAuth } = useAuthStore.getState();

  try {
    setLoadingState("isInitializing", true);

    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
      {},
      { withCredentials: true },
    );

    // Matches your backend structure: data.data.token
    if (data?.success && data?.data?.token) {
      setLoggedIn(data.data.user, data.data.token);
    }
  } catch (error) {
    console.log(error);
    // Refresh token cookie is missing or invalid, fail silently without error UI
    clearAuth();
  } finally {
    setLoadingState("isInitializing", false);
  }
};

export const signup = async (name, email, password, passwordConfirm) => {
  const { setLoadingState } = useAuthStore.getState();

  try {
    setLoadingState("isSigningUp", true);

    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
      passwordConfirm,
    });

    if (data.success) {
      toast.success(data.message || "Account created successfully");
      // No isLoggedIn/token update here - signup does not log the user in,
      // they still need to log in separately afterwards.
    } else {
      toast.error(data.message || "Signup failed");
    }

    return data;
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  } finally {
    setLoadingState("isSigningUp", false);
  }
};

export const login = async (email, password) => {
  const { setLoadingState, setLoggedIn } = useAuthStore.getState();

  try {
    setLoadingState("isLoggingIn", true);

    const { data } = await api.post("/auth/login", { email, password });

    if (data.success) {
      toast.success(data.message || "Logged in successfully");
      setLoggedIn(data.data.user, data.data.token);
      return data.success;
    } else {
      toast.error(data.message || "Login failed");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  } finally {
    setLoadingState("isLoggingIn", false);
  }
};

// Send Reset OTP
export const sendResetOtp = async (email) => {
  const { setLoadingState } = useAuthStore.getState();

  try {
    setLoadingState("isSendingOtp", true);
    const { data } = await api.post("/auth/forgot-password", {
      email: email.trim(),
    });

    return data;
  } finally {
    setLoadingState("isSendingOtp", false);
  }
};

// Verify OTP
export const verifyOtp = async (email, otp) => {
  const { setLoadingState } = useAuthStore.getState();

  try {
    setLoadingState("isVerifyingOtp", true);

    const { data } = await api.post("/auth/verify-otp", { email, otp });

    return data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Invalid or expired OTP");
    throw error;
  } finally {
    setLoadingState("isVerifyingOtp", false);
  }
};

// Reset Password
export const resetPassword = async (resetToken, password, passwordConfirm) => {
  const { setLoadingState } = useAuthStore.getState();

  try {
    setLoadingState("isResettingPassword", true);

    const { data } = await api.post("/auth/reset-password", {
      resetToken,
      password,
      passwordConfirm,
    });

    return data;
  } finally {
    setLoadingState("isResettingPassword", false);
  }
};

// ==================== Get User Data ====================

export const getUserData = async () => {
  const { setLoadingState, setUserData, clearAuth } = useAuthStore.getState();

  try {
    setLoadingState("isFetchingUser", true);

    const { data } = await api.get("/user/data");

    if (data.success) {
      setUserData(data.userData);
    } else {
      clearAuth();
    }
  } catch (error) {
    clearAuth();
    toast.error(error.response?.data?.message || error.message);
  } finally {
    setLoadingState("isFetchingUser", false);
  }
};

// ==================== Logout ====================

export const logout = async () => {
  const { setLoadingState, clearAuth } = useAuthStore.getState();

  try {
    setLoadingState("isLoggingOut", true);
    await api.post("/auth/logout");
    clearAuth();
    useWorkspaceStore.getState().clearWorkspaces();
    toast.success("Logged out successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  } finally {
    setLoadingState("isLoggingOut", false);
  }
};