import { create } from "zustand";

/**
 * Auth store
 *
 * Holds authentication state only. Does NOT import api.js, which avoids
 * a circular dependency (api.js's interceptor imports this store to read
 * the token and to check isLoggedOut).
 *
 * All actions that call the backend (signup, login, logout, etc.) live in
 * authActions.js instead - they call the API, then update this store
 * through the setters below.
 */
export const useAuthStore = create((set) => ({
  // ==================== State ====================
  isLoggedIn: false,
  isLoggedOut: false,
  userData: null,
  token: null,

    // Separate loading flags per action. Keeping a single shared isLoading
  // meant unrelated background calls (e.g. initializeAuth running on app
  // mount) could flip the same flag a login button was disabled on.
  isInitializing: false,
  isLoggingIn: false,
  isSigningUp: false,
  isLoggingOut: false,
  isFetchingUser: false,
  isSendingOtp: false,
  isVerifyingOtp: false,
  isResettingPassword: false,
  // ==================== Setters ====================

  setLoadingState: (key, value) => set({ [key]: value }),

  setToken: (token) => set({ token, isLoggedOut: false }),

  setUserData: (userData) => set({ userData }),

  setLoggedIn: (userData, token) =>
    set({
      isLoggedIn: true,
      userData: userData || null,
      token: token || null,
      isLoggedOut: false,
    }),

  // Reset helper invoked when authentication sessions expire completely
  // or the user explicitly logs out.
  clearAuth: () =>
    set({
      isLoggedIn: false,
      token: null,
      userData: null,
      isLoggedOut: true,
    }),
}));