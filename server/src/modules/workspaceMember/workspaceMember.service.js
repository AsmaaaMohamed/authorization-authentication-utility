import mongoose from 'mongoose';
import WorkspaceMember from './workspaceMember.model.js';
import Workspace from '../workspace/workspace.model.js';
import AppError from '../../utilities/AppError.js';

/**
 * Retrieve all workspaces available to the authenticated user.
 *
 * Returns workspace information along with the user's role,
 * total member count, and total project count.
 *
 * @param {string} userId - ID of the authenticated user.
 * @returns {Promise<Object[]>} Available workspaces with statistics.
 */
export const getMyWorkspaces = async (userId) => {
  const workspaces = await WorkspaceMember.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: 'workspaces',
        localField: 'workspaceId',
        foreignField: '_id',
        as: 'workspace',
      },
    },
    {
      $unwind: '$workspace',
    },
    {
      $lookup: {
        from: 'workspacemembers',
        localField: 'workspaceId',
        foreignField: 'workspaceId',
        as: 'members',
      },
    },
    {
      $lookup: {
        from: 'projects',
        localField: 'workspaceId',
        foreignField: 'workspaceId',
        as: 'projects',
      },
    },
    {
      $project: {
        _id: 0,
        id: '$workspace._id',
        name: '$workspace.name',
        role: 1,
        memberCount: { $size: '$members' },
        projectCount: { $size: '$projects' },
      },
    },
  ]);

  return workspaces;
};

/**
 * Retrieve all members belonging to the requested workspace.
 *
 * @param {string} workspaceId - ID of the workspace.
 * @param {string} [requestingUserId] - ID of the authenticated user requesting the list.
 * @returns {Promise<Array<{ userId: string, name: string, role: string }>>}
 */
export const getWorkspaceMembers = async (workspaceId, requestingUserId) => {
  if (!workspaceId || !mongoose.Types.ObjectId.isValid(workspaceId)) {
    throw new AppError('Invalid workspace ID.', 400);
  }

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new AppError('Workspace not found.', 404);
  }

  if (requestingUserId) {
    const isMember = await WorkspaceMember.findOne({
      workspaceId,
      userId: requestingUserId,
    });

    if (!isMember) {
      throw new AppError('You are not authorized to view members of this workspace.', 403);
    }
  }

  const members = await WorkspaceMember.find({ workspaceId })
    .populate('userId', 'name email avatar')
    .lean();

  return members.map((member) => ({
    userId: member.userId?._id?.toString() || member.userId?.toString(),
    name: member.userId?.name || 'Unknown',
    role: member.role,
  }));
};

