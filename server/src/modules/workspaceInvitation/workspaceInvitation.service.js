import crypto from 'crypto';
import mongoose from 'mongoose';

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

/**
 * Accept a workspace invitation.
 *
 * Validates the inviteToken, ensures it is active and not expired,
 * adds the user to the workspace as a member with the invited role,
 * and updates the invitation status to 'ACCEPTED' inside a transaction.
 *
 * @param {Object} params
 * @param {string} params.inviteToken - The invitation token.
 * @param {string} params.userId - The ID of the accepting authenticated user.
 * @returns {Promise<{ workspaceId: string, role: string }>}
 */
export const acceptWorkspaceInvitation = async ({ inviteToken, userId }) => {
  if (!inviteToken) {
    throw new AppError('inviteToken is required.', 400);
  }

  const invitation = await WorkspaceInvitation.findOne({
    token: inviteToken,
  });

  if (!invitation) {
    throw new AppError('Invalid invitation token.', 400);
  }

  const isExpired =
    invitation.status !== 'PENDING' ||
    new Date(invitation.expiresAt) < new Date();

  if (isExpired) {
    if (invitation.status === 'PENDING') {
      invitation.status = 'EXPIRED';
      await invitation.save();
    }
    throw new AppError(
      'Invitation token is expired or has already been used.',
      400,
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingMember = await WorkspaceMember.findOne({
      workspaceId: invitation.workspaceId,
      userId,
    }).session(session);

    if (!existingMember) {
      await WorkspaceMember.create(
        [
          {
            userId,
            workspaceId: invitation.workspaceId,
            role: invitation.role,
          },
        ],
        { session },
      );
    }

    invitation.status = 'ACCEPTED';
    await invitation.save({ session });

    await session.commitTransaction();

    return {
      workspaceId: invitation.workspaceId,
      role: invitation.role,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

