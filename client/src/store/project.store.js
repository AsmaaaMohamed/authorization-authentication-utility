import { create } from "zustand";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

export const useProjectStore = create((set) => ({
  createProject: async () => {},
}));
