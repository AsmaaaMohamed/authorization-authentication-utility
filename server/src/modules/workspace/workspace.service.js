import Workspace from './workspace.model.js';
import AppError from '../../utilities/AppError.js';

/**
 * Create a new workspace for the authenticated user.
 *
 * A user cannot create more than one workspace
 * with the same name.
 *
 * @param {Object} data
 * @param {string} data.name - Workspace name.
 * @param {string} [data.description] - Optional workspace description.
 * @param {string} [data.iconUrl] - Optional workspace icon URL.
 * @param {string} data.ownerId - ID of the workspace owner.
 * @returns {Promise<Workspace>} The created workspace.
 */
export const createWorkspace = async ({
  name,
  description,
  iconUrl,
  ownerId,
}) => {
  const existingWorkspace = await Workspace.findOne({
    ownerId,
    name,
  });

  if (existingWorkspace) {
    throw new AppError('You already have a workspace with this name.', 409);
  }

  const workspace = await Workspace.create({
    name,
    description,
    iconUrl,
    ownerId,
  });

  return workspace;
};

/**
 * Get all workspaces owned by the authenticated user.
 *
 * @param {string} ownerId - ID of the authenticated user.
 * @returns {Promise<Workspace[]>} List of user's workspaces.
 */
export const getMyWorkspaces = async (ownerId) => {
  const workspaces = await Workspace.find({ ownerId }).sort({
    createdAt: -1,
  });

  return workspaces;
};

/**
 * Update a workspace owned by the authenticated user.
 *
 * Prevents the user from changing the workspace name
 * to a name already used by another workspace owned by them.
 *
 * @param {string} workspaceId - ID of the workspace to update.
 * @param {string} ownerId - ID of the authenticated user.
 * @param {Object} data - Fields to update.
 * @returns {Promise<Workspace>} The updated workspace.
 * @throws {AppError} If the workspace does not exist or the name is duplicated.
 */
export const updateWorkspace = async (workspaceId, ownerId, data) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    ownerId,
  });

  if (!workspace) {
    throw new AppError('Workspace not found or you are not the owner.', 404);
  }

  if (data.name && data.name !== workspace.name) {
    const existingWorkspace = await Workspace.findOne({
      ownerId,
      name: data.name,
      _id: { $ne: workspaceId },
    });

    if (existingWorkspace) {
      throw new AppError('You already have a workspace with this name.', 409);
    }
  }

  Object.assign(workspace, data);

  await workspace.save();

  return workspace;
};

/**
 * Delete a workspace owned by the authenticated user.
 *
 * Ensures that only the workspace owner can delete it.
 *
 * @param {string} workspaceId - ID of the workspace to delete.
 * @param {string} ownerId - ID of the authenticated user.
 * @returns {Promise<Workspace>} The deleted workspace.
 * @throws {AppError} If the workspace does not exist or is not owned by the user.
 */
export const deleteWorkspace = async (workspaceId, ownerId) => {
  const workspace = await Workspace.findOneAndDelete({
    _id: workspaceId,
    ownerId,
  });

  if (!workspace) {
    throw new AppError('Workspace not found or you are not the owner.', 404);
  }

  return workspace;
};
