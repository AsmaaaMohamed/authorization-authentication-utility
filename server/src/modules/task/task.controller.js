import asyncHandler from '../../utilities/asyncHandler.js';
import {
  createTask,
  getBoardTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from './task.service.js';

/**
 * Create a new task.
 */
export const createTaskController = asyncHandler(async (req, res) => {
  const task = await createTask({
    ...req.body,
    ownerId: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    id: task.id,
    title: task.title,
    status: task.status,
    ownerId: task.ownerId,
    assigneeId: task.assigneeId,
    createdAt: task.createdAt,
    data: task,
  });
});

/**
 * Retrieve board tasks with pagination and filters.
 */
export const getBoardTasksController = asyncHandler(async (req, res) => {
  const boardId = req.params.boardId || req.query.boardId;
  const { page, limit, status, assigneeId } = req.query;

  const result = await getBoardTasks({
    boardId,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 20,
    status,
    assigneeId,
  });

  res.status(200).json({
    success: true,
    data: result.data,
    page: result.page,
    totalPages: result.totalPages,
    totalItems: result.totalItems,
  });
});

/**
 * Retrieve detailed task information by ID.
 */
export const getTaskDetailsController = asyncHandler(async (req, res) => {
  const task = await getTaskById(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    assigneeId: task.assigneeId,
    tags: task.tags,
    attachments: task.attachments,
    data: task,
  });
});

/**
 * Apply partial updates to an identified task.
 */
export const updateTaskController = asyncHandler(async (req, res) => {
  const updatedTask = await updateTask(req.params.id, req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: updatedTask,
  });
});

/**
 * Soft-delete an identified task.
 */
export const deleteTaskController = asyncHandler(async (req, res) => {
  await deleteTask(req.params.id, req.user?.id);
  res.status(204).send();
});




