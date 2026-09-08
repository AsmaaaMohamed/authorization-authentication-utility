import WorkspaceTag from './workspaceTag.model.js';

export const createWorkspaceTag = async ({
  workspaceId,
  name,
  color,
}) => {
  const workspaceTag = await WorkspaceTag.create({
    workspaceId,
    name,
    color,
  });

  return workspaceTag;
};