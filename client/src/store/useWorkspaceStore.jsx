import { create } from "zustand";
import api from "../services/api";

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

      const response = await api.get("/workspace");

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

      const response = await api.post("/workspace", workspaceData);

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

  // ==================== Update Workspace ====================
   updateWorkspace: async (id, workspaceData) => {
  try {
    // const response = await axios.patch(
    //   `${backendUrl}/api/workspaces/${id}`,
    //   workspaceData
    // );

    // const updatedWorkspace = response.data.workspace;
    let updatedWorkspace;
    set((state) => ({
      workspaces: state.workspaces.map((workspace) => {
        if (workspace.id === id) {
          updatedWorkspace = {
            ...workspace,
            ...workspaceData,
          };
          return updatedWorkspace;
        }
        return workspace;
      }),
    }));
    return updatedWorkspace;
  } catch (error) {
    set({
      error:
        error.response?.data?.message ||
        "Failed to update workspace",
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

      await api.delete(`/workspace/${id}`);

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
