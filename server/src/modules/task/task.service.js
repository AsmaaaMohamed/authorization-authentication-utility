import mongoose from 'mongoose';
import Task from './task.model.js';
import Project from '../project/project.model.js';
import Board from '../board/board.model.js';
import User from '../user/user.model.js';
import WorkspaceMember from '../workspaceMember/workspaceMember.model.js';
import AppError from '../../utilities/AppError.js';

/**
 * Create a new task in a project and board.
 *
 * @param {Object} data
 * @param {string} data.title - Task title.
 * @param {string} [data.description] - Task description.
 * @param {string} data.status - Task status ('todo', 'in_progress', 'done').
 * @param {string} data.projectId - Target project ID.
 * @param {string} data.boardId - Target board ID.
 * @param {string} data.assigneeId - User assigned to task.
 * @param {string} data.ownerId - User creating task (req.user.id).
 * @param {string[]} [data.tags] - Array of tags.
 * @param {string[]} [data.attachments] - Array of attachment URLs.
 * @returns {Promise<Object>} Created task data.
 */
export const createTask = async ({
  title,
  description = '',
  status,
  projectId,
  boardId,
  assigneeId,
  ownerId,
  tags = [],
  attachments = [],
}) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new AppError('Invalid project ID', 400);
  }
  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    throw new AppError('Invalid board ID', 400);
  }
  if (!mongoose.Types.ObjectId.isValid(assigneeId)) {
    throw new AppError('Invalid assignee ID', 400);
  }

  // 1. Verify Project exists
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError('Project not found', 404);
  }

  // 2. Verify Requester has access to Project Workspace
  if (project.workspaceId && ownerId) {
    const isMember = await WorkspaceMember.findOne({
      workspaceId: project.workspaceId,
      userId: ownerId,
    });
    if (!isMember) {
      throw new AppError('You do not have access to this project workspace', 403);
    }
  }

  // 3. Verify Board exists and belongs to Project
  const board = await Board.findById(boardId);
  if (board && board.projectId.toString() !== projectId.toString()) {
    throw new AppError('Board does not belong to the specified project', 400);
  }

  // 4. Verify Assignee exists
  const assignee = await User.findById(assigneeId);
  if (!assignee) {
    throw new AppError('Assignee not found', 404);
  }

  // 5. Create Task
  const task = await Task.create({
    title,
    description: description || '',
    status,
    projectId,
    boardId,
    ownerId,
    assigneeId,
    tags: tags || [],
    attachments: attachments || [],
  });

  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    projectId: task.projectId,
    boardId: task.boardId,
    ownerId: task.ownerId,
    assigneeId: task.assigneeId,
    tags: task.tags,
    attachments: task.attachments,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
};

/**
 * Retrieve tasks belonging to a board with pagination and filters.
 *
 * @param {Object} params
 * @param {string} params.boardId - Target board ID.
 * @param {number} [params.page=1] - Page number.
 * @param {number} [params.limit=20] - Number of items per page.
 * @param {string} [params.status] - Optional status filter ('todo', 'in_progress', 'done').
 * @param {string} [params.assigneeId] - Optional assignee ID filter.
 * @returns {Promise<{ data: Object[], page: number, totalPages: number, totalItems: number }>}
 */
export const getBoardTasks = async ({
  boardId,
  page = 1,
  limit = 20,
  status,
  assigneeId,
}) => {
  if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
    throw new AppError('Invalid board ID', 400);
  }

  const query = {
    boardId: new mongoose.Types.ObjectId(boardId),
    isDeleted: false,
  };

  if (status) {
    query.status = status;
  }

  if (assigneeId) {
    if (!mongoose.Types.ObjectId.isValid(assigneeId)) {
      throw new AppError('Invalid assignee ID', 400);
    }
    query.assigneeId = new mongoose.Types.ObjectId(assigneeId);
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.max(1, Number(limit) || 20);
  const skip = (pageNum - 1) * limitNum;

  const [tasks, totalItems] = await Promise.all([
    Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    Task.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalItems / limitNum) || 1;

  const formattedData = tasks.map((task) => ({
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    projectId: task.projectId,
    boardId: task.boardId,
    ownerId: task.ownerId,
    assigneeId: task.assigneeId,
    tags: task.tags,
    attachments: task.attachments,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));

  return {
    data: formattedData,
    page: pageNum,
    totalPages,
    totalItems,
  };
};

/**
 * Retrieve detailed task information.
 *
 * @param {string} taskId - Target task ID.
 * @param {string} userId - Requesting user ID.
 * @returns {Promise<Object>} Detailed task information.
 */
export const getTaskById = async (taskId, userId) => {
  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    throw new AppError('Invalid task ID', 400);
  }

  const task = await Task.findOne({
    _id: taskId,
    isDeleted: false,
  }).populate('projectId');

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  // Verify requester is a workspace member
  const workspaceId = task.projectId?.workspaceId;
  if (workspaceId && userId) {
    const isMember = await WorkspaceMember.findOne({
      workspaceId,
      userId,
    });
    if (!isMember) {
      throw new AppError('You are not authorized to access tasks in this workspace', 403);
    }
  }

  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    assigneeId: task.assigneeId,
    tags: task.tags,
    attachments: task.attachments,
    projectId: task.projectId?._id || task.projectId,
    boardId: task.boardId,
    ownerId: task.ownerId,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
};

/**
 * Apply partial updates to an identified task.
 *
 * @param {string} taskId - Target task ID.
 * @param {string} userId - Requesting user ID.
 * @param {Object} updateData - Fields to update.
 * @returns {Promise<Object>} Updated task data.
 */
export const updateTask = async (taskId, userId, updateData = {}) => {
  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    throw new AppError('Invalid task ID', 400);
  }

  if (updateData.assigneeId) {
    if (!mongoose.Types.ObjectId.isValid(updateData.assigneeId)) {
      throw new AppError('Invalid assignee ID', 400);
    }
    const assignee = await User.findById(updateData.assigneeId);
    if (!assignee) {
      throw new AppError('Assignee not found', 404);
    }
  }

  if (updateData.status && !['todo', 'in_progress', 'done'].includes(updateData.status)) {
    throw new AppError('Status must be todo, in_progress, or done', 400);
  }

  const task = await Task.findOne({
    _id: taskId,
    isDeleted: false,
  }).populate('projectId');

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  // Authorization: Requester must be task owner, assignee, or Workspace Admin/Owner
  const isOwner = task.ownerId?.toString() === userId?.toString();
  const isAssignee = task.assigneeId?.toString() === userId?.toString();

  let isAdmin = false;
  if (!isOwner && !isAssignee) {
    const workspaceId = task.projectId?.workspaceId;
    if (workspaceId && userId) {
      const membership = await WorkspaceMember.findOne({
        workspaceId,
        userId,
      });
      if (membership && ['OWNER', 'ADMIN'].includes(membership.role)) {
        isAdmin = true;
      }
    }
  }

  if (!isOwner && !isAssignee && !isAdmin) {
    throw new AppError('You are not authorized to update this task', 403);
  }


  // Whitelist supported fields
  const allowedFields = ['title', 'description', 'status', 'assigneeId', 'tags', 'attachments'];
  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      task[field] = updateData[field];
    }
  }

  await task.save();

  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    assigneeId: task.assigneeId,
    tags: task.tags,
    attachments: task.attachments,
    projectId: task.projectId?._id || task.projectId,
    boardId: task.boardId,
    ownerId: task.ownerId,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
};

/**
 * Soft-delete an identified task.
 *
 * Sets isDeleted to true and records deletedAt timestamp.
 *
 * @param {string} taskId - Target task ID.
 * @param {string} [userId] - Requesting user ID.
 * @returns {Promise<void>}
 */
export const deleteTask = async (taskId, userId) => {
  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    throw new AppError('Invalid task ID', 400);
  }

  const task = await Task.findOne({
    _id: taskId,
    isDeleted: false,
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  task.isDeleted = true;
  task.deletedAt = new Date();
  await task.save();
};




