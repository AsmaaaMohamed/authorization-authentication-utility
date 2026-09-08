import TaskTag from './taskTag.model.js';
import AppError from '../../utilities/AppError.js';
import mongoose from 'mongoose';

export const addTagToTask = async (taskId, tagId) => {
  if (!taskId) {
    throw new AppError('Task ID is required', 400);
  }

  if (!tagId) {
    throw new AppError('Tag ID is required', 400);
  }

  const existingRelation = await TaskTag.findOne({
    taskId,
    tagId,
  });

  if (existingRelation) {
    throw new AppError('Tag is already attached to this task', 409);
  }

  return TaskTag.create({
    taskId,
    tagId,
  });
};

export const removeTagFromTask = async (taskId, tagId) => {
  if (!taskId) {
    throw new AppError('Task ID is required', 400);
  }

  if (!tagId) {
    throw new AppError('Tag ID is required', 400);
  }

  await TaskTag.deleteOne({
    taskId,
    tagId,
  });
};

export const getTasksByTag = async (workspaceId, tagId) => {
  if (!workspaceId) {
    throw new AppError('Workspace ID is required', 400);
  }

  if (!tagId) {
    throw new AppError('Tag ID is required', 400);
  }

  const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);
  const tagObjectId = new mongoose.Types.ObjectId(tagId);

  return TaskTag.aggregate([
    { $match: { tagId: tagObjectId } },
    {
      $lookup: {
        from: 'workspacetags',
        localField: 'tagId',
        foreignField: '_id',
        as: 'tag',
      },
    },
    { $unwind: '$tag' },
    { $match: { 'tag.workspaceId': workspaceObjectId } },
    {
      $lookup: {
        from: 'tasks',
        localField: 'taskId',
        foreignField: '_id',
        as: 'task',
      },
    },
    { $unwind: '$task' },
    {
      $project: {
        _id: 0,
        taskId: '$task._id',
        title: '$task.title',
      },
    },
  ]);
};

