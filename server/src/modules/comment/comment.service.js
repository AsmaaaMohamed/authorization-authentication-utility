import Comment from './comment.model.js';
import WorkspaceMember from '../workspaceMember/workspaceMember.model.js';
import Task from '../task/task.model.js';
import Project from '../project/project.model.js';
import AppError from '../../utilities/AppError.js';

export const addTaskComment = async (taskId, userId, data) => {
 const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  const project = await Project.findById(task.projectId);
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  const member = await WorkspaceMember.findOne({
    userId,
    workspaceId: project.workspaceId,
  });

  if (!member) {
    throw new AppError(
      'You are not a member of this workspace',
      403,
    );
  }
  const comment = await Comment.create({
    taskId,
    userId,
    body: data.body,
    parentCommentId: data.parentCommentId || null,
  });

  return comment;
};

export const getTaskComment = async (taskId,userId
) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  const project = await Project.findById(task.projectId);
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  const member = await WorkspaceMember.findOne({
    userId,
    workspaceId: project.workspaceId,
  });

  if (!member) {
    throw new AppError(
      'You are not a member of this workspace',
      403,
    );
  }
  const comments = await Comment.find({
    taskId,
  });

  return comments;
};

export const editTaskComment = async (commentId,userId, data) => {
const comment = await Comment.findById(commentId);
if (!comment) {
  throw new AppError('Comment not found', 404);
}
const task = await Task.findById(comment.taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  const project = await Project.findById(task.projectId);
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  const member = await WorkspaceMember.findOne({
    userId,
    workspaceId: project.workspaceId,
  });

  if (!member) {
    throw new AppError(
      'You are not a member of this workspace',
      403,
    );
  }
  const updatecomment = await Comment.findOneAndUpdate(
    {
      _id: commentId,
    },
    {
      $set: data,
    },{
      new: true
    }
  );

  return updatecomment;
};

export const deleteTaskComment = async (commentId, userId) => {
 const comment = await Comment.findById(commentId);
if (!comment) {
  throw new AppError('Comment not found', 404);
}
const task = await Task.findById(comment.taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  const project = await Project.findById(task.projectId);
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  const member = await WorkspaceMember.findOne({
    userId,
    workspaceId: project.workspaceId,
  });

  if (!member) {
    throw new AppError(
      'You are not a member of this workspace',
      403,
    );
  }

  const usercomment = await Comment.findOne({
    _id: commentId,
    userId,
  });

  if (!usercomment) {
    throw new AppError(
      'Comment not found',
      404,
    );
  }

  await Comment.findByIdAndDelete(commentId);

  return {
    commentId,
    deletedAt: new Date().toISOString(),
  };
};