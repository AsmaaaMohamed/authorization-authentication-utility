import mongoose from 'mongoose';
import TaskTag from './taskTag.model.js';
import Task from '../task/task.model.js';
import Project from '../project/project.model.js';
import WorkspaceTag from '../workspaceTag/workspaceTag.model.js';
import AppError from '../../utilities/AppError.js';

export const addTagToTask = async (taskId, tagId) => {
  if (!taskId) {
    throw new AppError('Task ID is required', 400);
  }

  if (!tagId) {
    throw new AppError('Tag ID is required', 400);
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  const tag = await WorkspaceTag.findById(tagId);

  if (!tag) {
    throw new AppError('Tag not found.', 404);
  }

  const project = await Project.findById(task.projectId);

  if (!project) {
    throw new AppError('Task project not found.', 404);
  }

  const taskWorkspaceId = project.workspaceId?.toString();
  const tagWorkspaceId = tag.workspaceId?.toString();

  if (!taskWorkspaceId || !tagWorkspaceId) {
    throw new AppError('Task or tag workspace data is missing.', 400);
  }

  if (taskWorkspaceId !== tagWorkspaceId) {
    throw new AppError('This tag does not belong to the same workspace as the task.', 400);
  }

  const existingRelation = await TaskTag.findOne({ taskId, tagId });

  if (existingRelation) {
    throw new AppError('Tag is already attached to this task', 409);
  }

  const relation = await TaskTag.create({
    taskId,
    tagId,
  });

  await Task.findByIdAndUpdate(
    taskId,
    { $addToSet: { tags: tagId } },
    { new: true },
  );

  return relation;
};

export const removeTagFromTask = async (taskId, tagId) => {
  if (!taskId) {
    throw new AppError('Task ID is required', 400);
  }

  if (!tagId) {
    throw new AppError('Tag ID is required', 400);
  }

  const relation = await TaskTag.findOne({ taskId, tagId });

  if (!relation) {
    throw new AppError('Tag is not attached to this task', 404);
  }

  await TaskTag.deleteOne({
    taskId,
    tagId,
  });

  await Task.findByIdAndUpdate(
    taskId,
    { $pull: { tags: tagId } },
    { new: true },
  );
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

