import asyncHandler from '../../utilities/asyncHandler.js';

import { createWorkspaceInvitation } from './workspaceInvitation.service.js';

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
