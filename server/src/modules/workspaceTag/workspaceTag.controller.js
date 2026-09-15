import {
  createWorkspaceTag as createWorkspaceTagService,
  getWorkspaceTags as getWorkspaceTagsService,
  deleteWorkspaceTag as deleteWorkspaceTagService,
} from './workspaceTag.service.js';

export const createWorkspaceTag = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { name, color } = req.body;

    const workspaceTag = await createWorkspaceTagService({
      workspaceId,
      name,
      color,
    });

    return res.status(201).json({
      success: true,
      data: workspaceTag,
    });
  } catch (error) {
    next(error);
  }
};

export const listWorkspaceTags = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const tags = await getWorkspaceTagsService(workspaceId);

    return res.status(200).json({
      success: true,
      results: tags.length,
      data: tags,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkspaceTag = async (req, res, next) => {
  try {
    const { workspaceId, tagId } = req.params;
    const result = await deleteWorkspaceTagService(workspaceId, tagId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};