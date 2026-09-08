import * as taskTagService from './taskTag.service.js';

export const addTagToTask = async (req, res, next) => {
  try {
    const { id, tagId } = req.params;

    const taskTag = await taskTagService.addTagToTask(id, tagId);

    return res.status(200).json({
      taskId: taskTag.taskId,
      tagId: taskTag.tagId,
    });
  } catch (error) {
    next(error);
  }
};

export const removeTagFromTask = async (req, res, next) => {
  try {
    const { id, tagId } = req.params;

    await taskTagService.removeTagFromTask(id, tagId);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getTasksByTag = async (req, res, next) => {
  try {
    const { id, tagId } = req.params;
    const tasks = await taskTagService.getTasksByTag(id, tagId);

    return res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};