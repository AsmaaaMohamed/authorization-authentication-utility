import crypto from 'crypto';

import User from '../user/user.model.js';
import Workspace from '../workspace/workspace.model.js';
import WorkspaceMember from '../workspaceMember/workspaceMember.model.js';
import WorkspaceInvitation from './workspaceInvitation.model.js';

import AppError from '../../utilities/AppError.js';

/**
 * Create a workspace invitation.
 *
 * Only workspace owners and admins can invite new members.
 * Prevents inviting existing members or creating duplicate
 * pending invitations for the same workspace and email.
 *
 * @param {Object} data
 * @param {string} data.workspaceId - Workspace ID.
 * @param {string} data.invitedBy - ID of the authenticated user.
 * @param {string} data.email - Email address of the invited user.
 * @param {string} data.role - Invitation role.
 * @returns {Promise<WorkspaceInvitation>} Created invitation.
 */
export const createWorkspaceInvitation = async ({
  workspaceId,
  invitedBy,
  email,
  role,
}) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw new AppError('No user found with this email.', 404);
  }

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new AppError('Workspace not found.', 404);
  }

  const member = await WorkspaceMember.findOne({
    workspaceId,
    userId: invitedBy,
  });

  if (!member || !['OWNER', 'ADMIN'].includes(member.role)) {
    throw new AppError(
      'Only workspace owners and admins can send invitations.',
      403,
    );
  }

  const existingMember = await WorkspaceMember.findOne({
    workspaceId,
  }).populate({
    path: 'userId',
    match: { email: normalizedEmail },
  });

  if (existingMember?.userId) {
    throw new AppError('This user is already a workspace member.', 409);
  }

  const existingInvitation = await WorkspaceInvitation.findOne({
    workspaceId,
    email: normalizedEmail,
    status: 'PENDING',
  });

  if (existingInvitation) {
    throw new AppError(
      'A pending invitation already exists for this email.',
      409,
    );
  }

  const token = crypto.randomBytes(32).toString('hex');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const invitation = await WorkspaceInvitation.create({
    workspaceId,
    invitedBy,
    email: normalizedEmail,
    role,
    token,
    expiresAt,
  });

  // Trigger email service here.
  // await sendWorkspaceInvitationEmail({
  //   email: normalizedEmail,
  //   workspaceName: workspace.name,
  //   token,
  // });

  return invitation;
};
