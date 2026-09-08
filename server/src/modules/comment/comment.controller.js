import * as commentService from './comment.service.js';

export const addTaskComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const { body, parentCommentId } = req.body;

    const comment = await commentService.addTaskComment(
      taskId,
      userId,
      {
        body,
        parentCommentId,
      },
    );

    return res.status(201).json({
      success: true,
      data: {
        id: comment._id,
        taskId: comment.taskId,
        userId: comment.userId,
        body: comment.body,
        parentCommentId: comment.parentCommentId,
        createdAt: comment.createdAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getTaskComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const comments = await commentService.getTaskComment(taskId);

    return res.status(200).json({
      status: 'success',
      data: comments,
    });
  } catch (error) {
    return next(error);
  }
};

export const editTaskComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await commentService.editTaskComment(
      commentId,
      req.body,
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteTaskComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await commentService.deleteTaskComment(
      commentId,
      userId,
    );

    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      data: comment,
    });
  } catch (error) {
    return next(error);
  }
};