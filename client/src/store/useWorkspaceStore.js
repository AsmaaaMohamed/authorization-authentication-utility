import { create } from "zustand";
import api from "../services/api";

const normalizeWorkspace = (workspace) => ({
  ...workspace,
  id: workspace.id || workspace._id,
  name: workspace.name || "Untitled workspace",
  memberCount: workspace.memberCount ?? workspace.members?.length ?? 0,
  projectCount: workspace.projectCount ?? workspace.projects?.length ?? 0,
  members: workspace.members || [],
  projects: workspace.projects || [],
});

export const useWorkspaceStore = create((set) => ({
  workspaces: [],
  users: [],
  workspaceMembers: [],
  boards: [],
  isLoading: false,
  isCreating: false,
  isDeleting: false,
  isUpdating: false,
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
      const workspaces = (response.data?.data || []).map(normalizeWorkspace);
      set({
        workspaces,
        isLoading: false,
        error: null,
      });
      return workspaces;
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
      const newWorkspace = normalizeWorkspace(response.data.data);
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
      const updatedWorkspace = normalizeWorkspace(response.data?.data || response.data?.workspace || {});
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
        workspaces: state.workspaces.filter((workspace) => workspace.id !== id && workspace._id !== id),
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
  try {
    const response = await api.post(
      `/workspace/${workspaceId}/invitations`,
      data
    );
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
    set({ isCreating: true, error: null });
    if (!name.trim()) {
      set({
        isCreating: false,
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
    set((state) => ({
      boards: [...state.boards, board],
      isCreating: false,
      error: null,
    }));
    return board;
  } catch (error) {
    set({
      isCreating: false,
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
      `/boards/${projectId}/boards`
    );
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
updateBoard: async (projectId, boardId, name) => {
  try {
    set({ isUpdating: true, error: null });
    const response = await api.patch(
      `/boards/${projectId}/boards/${boardId}`,
      { name: name.trim() }
    );
    const updatedBoard = response.data?.data?.board || response.data?.data;
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId ? updatedBoard : board
      ),
      isUpdating: false,
    }));
    return updatedBoard;
  } catch (error) {
    set({
      isUpdating: false,
      error:
        error.response?.data?.message ||
        "Failed to update board",
    });
    throw error;
  }
},
deleteBoard: async (projectId, boardId) => {
  try {
    set({ isDeleting: true, error: null });
    await api.delete(
      `/boards/${projectId}/boards/${boardId}`
    );
    set((state) => ({
      boards: state.boards.filter(
        (board) => board.id !== boardId
      ),
      isDeleting: false,
    }));
  } catch (error) {
    set({
      isDeleting: false,
      error:
        error.response?.data?.message ||
        "Failed to delete board",
    });
    throw error;
  }
},
}));
