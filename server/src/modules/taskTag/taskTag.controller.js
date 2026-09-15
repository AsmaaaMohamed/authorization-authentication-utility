import * as taskTagService from './taskTag.service.js';

export const addTagToTask = async (req, res, next) => {
  try {
    const { taskId, tagId } = req.params;

    const taskTag = await taskTagService.addTagToTask(taskId, tagId);

    return res.status(200).json({
      success: true,
      data: {
        taskId: taskTag.taskId,
        tagId: taskTag.tagId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const removeTagFromTask = async (req, res, next) => {
  try {
    const { taskId, tagId } = req.params;

    await taskTagService.removeTagFromTask(taskId, tagId);

    return res.status(200).json({
      success: true,
      message: 'Tag removed from task.',
    });
  } catch (error) {
    next(error);
  }
};

export const getTasksByTag = async (req, res, next) => {
  try {
    const { workspaceId, tagId } = req.params;
    const tasks = await taskTagService.getTasksByTag(workspaceId, tagId);

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};