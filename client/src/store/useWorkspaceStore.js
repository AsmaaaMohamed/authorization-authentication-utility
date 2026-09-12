import { create } from "zustand";
import api from "../services/api";

const dummyWorkspaces = [
  {
    id: "1",
    name: "Product Team",
    role: "Owner",
    members: [
      {
        userId: "101",
        role: "Admin",
        status: "Active",
      },
      {
        userId: "102",
        role: "Member",
        status: "Active",
      },
    ],
    projects: 3,
  },
  {
    id: "2",
    name: "Backend Utils",
    role: "Admin",
    members: [
      {
        id: "201",
        role: "Member",
        status: "Active",
      },
    ],
    projects: 1,
  },
  {
    id: "3",
    name: "Freelance Clients",
    role: "Member",
    members: [
      {
        id: "301",
        role: "Member",
        status: "Active",
      },
    ],
    projects: 5,
  },
];
const dummyUsers = [
  {
    id: "101",
    name: "Ahmed Ali",
    email: "ahmed@gmail.com",
  },
  {
    id: "102",
    name: "Sara Ahmed",
    email: "sara@gmail.com",
  },
  {
    id: "103",
    name: "Ali Hassan",
    email: "ali@gmail.com",
  },
  {
    id: "104",
    name: "Mona Samir",
    email: "mona@gmail.com",
  },
];

export const useWorkspaceStore = create((set) => ({
  workspaces: dummyWorkspaces,
  users: dummyUsers,
  workspaceMembers: [],
  boards: [],
  isLoading: false,
  error: null,
  // ==================== Clear Workspaces ====================
  clearWorkspaces: () => set({ workspaces: [] }),
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
    const response = await api.patch(`/workspace/${id}`, workspaceData);
    const updatedWorkspace = response.data.workspace;
    set((state) => ({
      workspaces: state.workspaces.map((workspace) =>
        workspace.id === id ? { ...workspace, ...updatedWorkspace } : workspace
      ),
    }));
    return updatedWorkspace;
  } catch (error) {
    set({
      error: error.response?.data?.message || "Failed to update workspace",
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
/////////////  Members store ////////////
inviteMember: async (workspaceId, data) => {
  set({ isLoading: true });
  console.log("Inviting member to workspaceId:", workspaceId, "with data:", data); // Log the workspaceId and data to verify they are correct
  try {
    const response = await api.post(
      `/workspace/${workspaceId}/invitations`,
      data
    );
    console.log("Invitation response:", response.data); // Log the response to see what data is returned
    const invitation = response.data.data;
    set((state) => ({
      workspaces: state.workspaces.map((workspace) =>
        workspace.id === Number(workspaceId)
          ? {
              ...workspace,
              members: [...(workspace.members || []), invitation],
            }
          : workspace
      ),
    }));
    return invitation;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    set({ isLoading: false });
  }
},
acceptInvitation: async (inviteToken) => {
  try {
    set({ isLoading: true, error: null });

    const { data } = await api.post(
      "/workspace/invitations/accept",
      { inviteToken }
    );

    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Failed to accept invitation";

    set({ error: message });
    throw error;
  } finally {
    set({ isLoading: false });
  }
},
getMembers: async (workspaceId) => {
  try {
    set({
      isLoading: true,
      error: null,
    });
    const response = await api.get(
      `/workspace/${workspaceId}/members`
    );
    const members = response.data.data.members || [];
    set({
      workspaceMembers: members,
      isLoading: false,
      error: null,
    });
    return members;
  } catch (error) {
    set({
      workspaceMembers: [],
      isLoading: false,
      error:
        error.response?.data?.message ||
        "Failed to fetch workspace members",
    });
    throw error;
  }
},
createBoard: async ({projectId, name}) => {
  try {
    set({ isLoading: true, error: null });
    if (!name.trim()) {
      set({
        isLoading: false,
        error: "Board name is required",
      });
      return;
    }
    const response = await api.post(
      `/projects/${projectId}/boards`,
      {
        name: name.trim(),
      }
    );
    const board = response.data.data.board;
    console.log(response.data); // Log the response to see what data is returned
    set((state) => ({
      boards: [...state.boards, board],
      isLoading: false,
      error: null,
    }));
    return board;
  } catch (error) {
    set({
      isLoading: false,
      error:
        error.response?.data?.message ||
        "Failed to create board",
    });
    throw error;
  }
},
getBoards: async (projectId) => {
  try {
    set({
      isLoading: true,
      error: null,
    });
    const response = await api.get(
      `/projects/${projectId}/boards`
    );
    console.log(response.data); // Log the response to see what data is returned
    const boards = response.data.data.boards || [];
    set({
      boards: boards,
      isLoading: false,
      error: null,
    });
    return boards;
  } catch (error) {
    set({
      boards: [],
      isLoading: false,
      error:
        error.response?.data?.message ||
        "Failed to fetch boards",
    });
    throw error;
  }
},
}));
