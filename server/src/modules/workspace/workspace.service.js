import Workspace from './workspace.model.js';

export const createWorkspace = async ({
  name,
  description,
  iconUrl,
  ownerId,
}) => {
  const workspace = await Workspace.create({
    name,
    description,
    iconUrl,
    ownerId,
  });

  return workspace;
};
