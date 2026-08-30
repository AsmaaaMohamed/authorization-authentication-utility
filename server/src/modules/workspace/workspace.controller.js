import {
  createWorkspace,
  getUserWorkspaces,
  updateWorkspace,
  deleteWorkspace,
} from './workspace.service.js';
import { getWorkspaceMembers } from '../workspaceMember/workspaceMember.service.js';

import asyncHandler from '../../utilities/asyncHandler.js';

/**
 * Create a new workspace.
 */
export const createWorkspaceController = asyncHandler(async (req, res) => {
  const workspace = await createWorkspace({
    ...req.body,
    ownerId: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: workspace,
  });
});

/**
 * Get all workspaces owned by the authenticated user.
 */
export const getMyWorkspacesController = asyncHandler(async (req, res) => {
  const workspaces = await getUserWorkspaces(req.user.id);

  res.status(200).json({
    success: true,
    results: workspaces.length,
    data: workspaces,
  });
});

/**
 * Update a workspace owned by the authenticated user.
 */
export const updateWorkspaceController = asyncHandler(async (req, res) => {
  const workspace = await updateWorkspace(req.params.id, req.user.id, req.body);

  res.status(200).json({
    success: true,
    data: workspace,
  });
});

/**
 * Delete a workspace owned by the authenticated user.
 */
export const deleteWorkspaceController = asyncHandler(async (req, res) => {
  await deleteWorkspace(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Workspace deleted successfully.',
  });
});

/**
 * Get all members belonging to a workspace.
 */
export const getWorkspaceMembersController = asyncHandler(async (req, res) => {
  const workspaceId = req.params.workspaceId || req.params.id;
  const members = await getWorkspaceMembers(workspaceId, req.user?.id);

  res.status(200).json({
    success: true,
    results: members.length,
    members,
    data: {
      members,
    },
  });
});

