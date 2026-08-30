import * as projectService from './project.service.js';

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
