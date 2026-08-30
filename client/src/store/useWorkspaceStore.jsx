import { create } from "zustand";
import axios from "axios";

// const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
axios.defaults.withCredentials = true;
const dummyWorkspaces = [
  {
    id: "1",
    name: "Product Team",
    role: "Owner",
    members: 6,
    projects: 3,
  },
  {
    id: "2",
    name: "Backend Utils",
    role: "Admin",
    members: 4,
    projects: 1,
  },
  {
    id: "3",
    name: "Freelance Clients",
    role: "Member",
    members: 2,
    projects: 5,
  },
];
export const useWorkspaceStore = create((set) => ({
  workspaces: dummyWorkspaces,
  isLoading: false,
  error: null,

  createWorkspace: async (workspaceData) => {
    try {
        console.log("Creating workspace:", workspaceData);
      set({ isLoading: true, error: null });

      const data = new FormData();

      data.append("name", workspaceData.name);
      data.append("description", workspaceData.description);

      if (workspaceData.icon) {
        data.append("icon", workspaceData.icon);
      }

    //   const response = await axios.post(
    //     `${backendUrl}/api/workspaces`,
    //     data,
    //   );

      set((state) => ({
      workspaces: [
        ...state.workspaces,
        {
          ...workspaceData,
          id: Date.now().toString(),
          role: "Owner",
          members: 1,
          projects: 0,
        },
      ],
      isLoading: false,
      error: null,
    }));
        console.log("Workspace added");
    //   return response.data.workspace;
    return workspaceData; // Return the new workspace data for immediate use
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to create workspace",
        isLoading: false,
      });

      throw error;
    }
  },
  deleteWorkspace: async (id) => {
    // await axios.delete(`${backendUrl}/api/workspaces/${id}`);
    set((state) => ({
      workspaces: state.workspaces.filter(
        (workspace) => workspace.id !== id
      ),
    }));
  },
}));