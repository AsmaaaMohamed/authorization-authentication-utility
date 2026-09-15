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
    const invitation = await createWorkspaceInvitation({
      workspaceId: req.params.workspaceId,
      invitedBy: req.user.id,
      email: req.body.email,
      role: req.body.role,
    });

    res.cookie('inviteToken', invitation.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
    const inviteToken =
      req.cookies?.inviteToken ?? req.body?.inviteToken ?? req.query?.inviteToken;

    const result = await acceptWorkspaceInvitation({
      inviteToken,
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

