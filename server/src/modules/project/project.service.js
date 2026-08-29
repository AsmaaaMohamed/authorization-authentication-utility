import Project from './project.model.js';
import AppError from '../../utilities/AppError.js';

export const createProject = async (projectData, workspaceIdFromParam = '') => {
  const workspaceId = projectData.workspaceId || workspaceIdFromParam || '';

  const project = await Project.create({
    name: projectData.name,
    description: projectData.description || '',
    workspaceId,
  });

  return project;
};

export const deleteProject = async (projectId, userId) => {
  if (!projectId) {
    throw new AppError('Project ID is required', 400);
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  await Project.findByIdAndDelete(projectId);

  return {
    projectId,
    deletedAt: new Date().toISOString(),
  };
};
