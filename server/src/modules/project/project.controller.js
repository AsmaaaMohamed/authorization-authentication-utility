import * as projectService from './project.service.js';
export const getWorkspaceProjects = async (req, res, next) => {
  try {
    const { id } = req.params;

    const projects = await projectService.getProjectsByWorkspace(id);

    return res.status(200).json({
      status: 'success',
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(
      req.body,
      req.params.workspaceId,
    );

    return res.status(201).json({
      success: true,
      data: {
        project,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const result = await projectService.deleteProject(projectId, userId);

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    const project = await projectService.updateProject(
      id,
      req.user.workspaceId,
      updateData,
    );

    if (!project) {
      return res.status(404).json({
        message: 'Project not found or you do not have access to it',
      });
    }

    return res.status(200).json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};
