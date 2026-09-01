import { create } from "zustand";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

axios.defaults.withCredentials = true;

const dummyWorkspaces = [
  {
    _id: "1",
    name: "Product Team",
    role: "Owner",
    members: 6,
    projects: 3,
  },
];

export const useWorkspaceStore = create((set) => ({
  workspaces: dummyWorkspaces,
  isLoading: false,
  error: null,

  // ==================== Get Workspaces ====================

  getAllWorkspace: async () => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await axios.get(`${backendUrl}/workspace`);

      set({
        workspaces: response.data.data || [],
        isLoading: false,
        error: null,
      });

      return response.data.data;
    } catch (error) {
      set({
        workspaces: [],
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch workspaces",
      });

      throw error;
    }
  },

  // ==================== Create Workspace ====================

  createWorkspace: async (workspaceData) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      const response = await axios.post(
        `${backendUrl}/workspace`,
        workspaceData,
      );

      const newWorkspace = response.data.data;

      set((state) => ({
        workspaces: [...state.workspaces, newWorkspace],
        isLoading: false,
        error: null,
      }));

      return newWorkspace;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to create workspace",
      });

      throw error;
    }
  },

  // ==================== Delete Workspace ====================

  deleteWorkspace: async (id) => {
    try {
      set({
        isLoading: true,
        error: null,
      });

      await axios.delete(`${backendUrl}/workspace/${id}`);

      set((state) => ({
        workspaces: state.workspaces.filter(
          (workspace) => workspace._id !== id,
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to delete workspace",
      });

      throw error;
    }
  },
}));
