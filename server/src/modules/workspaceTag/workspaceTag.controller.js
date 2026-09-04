import { createWorkspaceTag as createWorkspaceTagService } from './workspaceTag.service.js';

export const createWorkspaceTag = async (
  req,
  res,
  next,
) => {
  try {
    const { workspaceId } = req.params;
    const { name, color } = req.body;

    const workspaceTag =
      await createWorkspaceTagService({
        workspaceId,
        name,
        color,
      });

    return res.status(201).json({
      id: workspaceTag._id,
      name: workspaceTag.name,
      color: workspaceTag.color,
    });
  } catch (error) {
    next(error);
  }
};