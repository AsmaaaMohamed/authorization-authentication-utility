import mongoose from 'mongoose';
import WorkspaceMember from './workspaceMember.model.js';

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
