import asyncHandler from '../../utilities/asyncHandler.js';

import {
  createWorkspaceInvitation,
  acceptWorkspaceInvitation,
} from './workspaceInvitation.service.js';

/**
 * Send a workspace invitation.
 */
export const createWorkspaceInvitationController = asyncHandler(
  async (req, res) => {
    await createWorkspaceInvitation({
      workspaceId: req.params.workspaceId,
      invitedBy: req.user.id,
      email: req.body.email,
      role: req.body.role,
    });

    res.status(200).json({
      success: true,
      message: 'Invitation sent successfully.',
    });
  },
);

/**
 * Accept a workspace invitation.
 */
export const acceptWorkspaceInvitationController = asyncHandler(
  async (req, res) => {
    const result = await acceptWorkspaceInvitation({
      inviteToken: req.body.inviteToken,
      userId: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: 'Invitation accepted successfully.',
      workspaceId: result.workspaceId,
      role: result.role,
      data: result,
    });
  },
);

