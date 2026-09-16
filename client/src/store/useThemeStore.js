import { create } from "zustand";

const THEME_KEY = "teamforge-theme";

const getSystemTheme = () => {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

const getStoredTheme = () => {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return getSystemTheme();
};

export const initializeTheme = () => {
  const theme = getStoredTheme();
  document.documentElement.dataset.theme = theme;
  if (typeof window !== "undefined") {
    localStorage.setItem(THEME_KEY, theme);
  }
  return theme;
};

export const useThemeStore = create((set) => ({
  theme: initializeTheme(),
  setTheme: (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem(THEME_KEY, nextTheme);
      return { theme: nextTheme };
    }),
}));
