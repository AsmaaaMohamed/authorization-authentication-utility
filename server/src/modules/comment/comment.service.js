import Comment from './comment.model.js';
import AppError from '../../utilities/AppError.js';

export const addTaskComment = async (taskId, userId, data) => {
  const comment = await Comment.create({
    taskId,
    userId,
    body: data.body,
    parentCommentId: data.parentCommentId || null,
  });

  return comment;
};

export const getTaskComment = async (taskId) => {
  const comments = await Comment.find({
    taskId,
  });

  return comments;
};

export const editTaskComment = async (commentId, data) => {
  const comment = await Comment.findOneAndUpdate(
    {
      _id: commentId,
    },
    {
      $set: data,
    }
  );

  return comment;
};

export const deleteTaskComment = async (commentId, userId) => {
  if (!commentId) {
    throw new AppError('Comment ID is required', 400);
  }

  const comment = await Comment.findOne({
    _id: commentId,
    userId,
  });

  if (!comment) {
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