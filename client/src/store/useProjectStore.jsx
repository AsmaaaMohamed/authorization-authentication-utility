import { create } from "zustand";
import api from "../services/api";

export const useProjectStore = create((set) => ({
  projects: [],
  isLoading: false,
  isUpdating: false,
  error: null,

  // ==================== Clear Projects ====================
  clearProjects: () => set({ projects: [] }),

  // ==================== Get Projects ====================
  // GET /projects/workspaces/:id/projects
  getWorkspaceProjects: async (workspaceId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/projects/workspaces/${workspaceId}/projects`);
      const projects = response.data?.data?.projects || [];
      set({ projects, isLoading: false, error: null });
      return projects;
    } catch (error) {
      set({
        projects: [],
        isLoading: false,
        error: error.response?.data?.message || "Failed to fetch projects",
      });
      throw error;
    }
  },

  // ==================== Create Project ====================
  // POST /projects/:workspaceId/projects
  createProject: async (workspaceId, projectData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post(
        `/projects/${workspaceId}/projects`,
        projectData
      );
      const newProject = response.data?.data?.project;
      set((state) => ({
        projects: [...state.projects, newProject],
        isLoading: false,
        error: null,
      }));
      return newProject;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to create project",
      });
      throw error;
    }
  },

  // ==================== Update Project ====================
  // PATCH /projects/:id/project

  updateProject: async (id, projectData) => {
    try {
      set({ isUpdating: true, error: null });
      const response = await api.patch(`/projects/${id}/project`, projectData);
      const updatedProject = response.data?.project;
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...updatedProject } : p
        ),
        isUpdating: false,
        error: null,
      }));
      return updatedProject;
    } catch (error) {
      set({
        isUpdating: false,
        error: error.response?.data?.message || "Failed to update project",
      });
      throw error;
    }
  },
}));
