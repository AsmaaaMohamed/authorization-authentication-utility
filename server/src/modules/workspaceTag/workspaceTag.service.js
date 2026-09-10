import WorkspaceTag from './workspaceTag.model.js';

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
  const workspaceTag = await WorkspaceTag.create({
    workspaceId,
    name,
    color,
  });

  return sanitizeWorkspaceTag(workspaceTag);
};
