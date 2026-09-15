import WorkspaceTag from './workspaceTag.model.js';
import AppError from '../../utilities/AppError.js';

// helper functions
const sanitizeWorkspaceTag = (workspaceTag) => ({
  id: workspaceTag._id,
  name: workspaceTag.name,
  color: workspaceTag.color,
  workspaceId: workspaceTag.workspaceId,
  createdAt: workspaceTag.createdAt,
  updatedAt: workspaceTag.updatedAt,
});

export const createWorkspaceTag = async ({ workspaceId, name, color }) => {
  if (!workspaceId) {
    throw new AppError('Workspace ID is required.', 400);
  }

  const normalizedName = name?.trim();

  if (!normalizedName) {
    throw new AppError('Tag name is required.', 400);
  }

  try {
    const workspaceTag = await WorkspaceTag.create({
      workspaceId,
      name: normalizedName,
      color: color?.trim(),
    });

    return sanitizeWorkspaceTag(workspaceTag);
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('A tag with this name already exists in this workspace.', 409);
    }
    throw error;
  }
};

export const getWorkspaceTags = async (workspaceId) => {
  if (!workspaceId) {
    throw new AppError('Workspace ID is required.', 400);
  }

  const tags = await WorkspaceTag.find({ workspaceId }).sort({ createdAt: -1 });
  return tags.map(sanitizeWorkspaceTag);
};

export const deleteWorkspaceTag = async (workspaceId, tagId) => {
  if (!workspaceId) {
    throw new AppError('Workspace ID is required.', 400);
  }

  if (!tagId) {
    throw new AppError('Tag ID is required.', 400);
  }

  const tag = await WorkspaceTag.findOne({ _id: tagId, workspaceId });

  if (!tag) {
    throw new AppError('Tag not found in this workspace.', 404);
  }

  await tag.deleteOne();
  return { deleted: true, tagId };
};
