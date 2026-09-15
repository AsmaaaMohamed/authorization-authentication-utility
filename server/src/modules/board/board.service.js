import mongoose from 'mongoose';
import Board from './board.model.js';
import Project from '../project/project.model.js';
import WorkspaceMember from '../workspaceMember/workspaceMember.model.js';
import Task from '../task/task.model.js';
import AppError from '../../utilities/AppError.js';

// helper functions
const sanitizeBoard = (board) => ({
  id: board._id,
  name: board.name,
  createdBy: board.createdBy,
  projectId: board.projectId,
  columns: (board.columns || []).map((column) => ({
    id: column._id,
    title: column.title,
    status: column.status,
    order: column.order,
  })),
  createdAt: board.createdAt,
  updatedAt: board.updatedAt,
});

const assertProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  const membership = await WorkspaceMember.findOne({
    workspaceId: project.workspaceId,
    userId,
  });

  if (!membership) {
    throw new AppError('You do not have access to this project.', 403);
  }

  return project;
};

export const createBoard = async (projectId, userId, name) => {
  const project = await assertProjectAccess(projectId, userId);

  try {
    const board = await Board.create({
      name: name?.trim() || `${project.name} Board`,
      projectId,
      createdBy: userId,
      columns: [
        { title: 'Todo', status: 'todo', order: 0 },
        { title: 'In Progress', status: 'in_progress', order: 1 },
        { title: 'Done', status: 'done', order: 2 },
      ],
    });

    return sanitizeBoard(board);
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError(
        'A board with this name already exists in this project.',
        409,
      );
    }

    throw err;
  }
};

export const listProjectBoards = async (projectId, userId) => {
  await assertProjectAccess(projectId, userId);

  const boards = await Board.find({ projectId })
    .populate({ path: 'createdBy', select: 'name email' })
    .populate({
      path: 'projectId',
      select: 'name description',
    })
    .sort({ createdAt: -1 });

  return boards.map(sanitizeBoard);
};

export const updateBoard = async (projectId, boardId, userId, updates) => {
  await assertProjectAccess(projectId, userId);

  const board = await Board.findOne({
    _id: boardId,
    projectId,
  });

  if (!board) {
    throw new AppError('Board not found.', 404);
  }

  if (updates.name !== undefined) {
    board.name = updates.name;
  }

  try {
    await board.save();
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError(
        'A board with this name already exists in this project.',
        409,
      );
    }

    throw err;
  }

  return sanitizeBoard(board);
};

export const addBoardColumn = async (projectId, boardId, userId, columnData) => {
  await assertProjectAccess(projectId, userId);

  const board = await Board.findOne({ _id: boardId, projectId });

  if (!board) {
    throw new AppError('Board not found.', 404);
  }

  const title = columnData.title?.trim();
  const status = columnData.status || title.toLowerCase().replace(/\s+/g, '_');

  if (!title) {
    throw new AppError('Column title is required.', 400);
  }

  const exists = board.columns.some(
    (column) =>
      column.title.toLowerCase() === title.toLowerCase() ||
      column.status === status,
  );

  if (exists) {
    throw new AppError('A column with this title or status already exists.', 409);
  }

  board.columns.push({
    title,
    status,
    order: board.columns.length,
  });

  await board.save();

  const newColumn = board.columns[board.columns.length - 1];

  return {
    id: newColumn._id,
    title: newColumn.title,
    status: newColumn.status,
    order: newColumn.order,
  };
};

export const updateBoardColumn = async (
  projectId,
  boardId,
  columnId,
  userId,
  updates,
) => {
  await assertProjectAccess(projectId, userId);

  const board = await Board.findOne({ _id: boardId, projectId });

  if (!board) {
    throw new AppError('Board not found.', 404);
  }

  const column = board.columns.id(columnId);

  if (!column) {
    throw new AppError('Column not found.', 404);
  }

  if (updates.title !== undefined) {
    const title = updates.title.trim();

    if (!title) {
      throw new AppError('Column title is required.', 400);
    }

    column.title = title;
  }

  if (updates.status !== undefined) {
    column.status = updates.status;
  }

  if (updates.order !== undefined) {
    const nextOrder = Number(updates.order);

    if (Number.isNaN(nextOrder)) {
      throw new AppError('Column order must be a number.', 400);
    }

    column.order = nextOrder;
  }

  board.columns.sort((a, b) => a.order - b.order);
  await board.save();

  return {
    id: column._id,
    title: column.title,
    status: column.status,
    order: column.order,
  };
};

export const deleteBoardColumn = async (projectId, boardId, columnId, userId) => {
  await assertProjectAccess(projectId, userId);

  const board = await Board.findOne({ _id: boardId, projectId });

  if (!board) {
    throw new AppError('Board not found.', 404);
  }

  const columnIndex = board.columns.findIndex((column) => column._id.toString() === columnId);

  if (columnIndex === -1) {
    throw new AppError('Column not found.', 404);
  }

  const column = board.columns[columnIndex];
  const taskCount = await Task.countDocuments({
    boardId,
    status: column.status,
    isDeleted: false,
  });

  if (taskCount > 0) {
    throw new AppError('Only empty columns can be deleted.', 400);
  }

  board.columns.splice(columnIndex, 1);
  board.columns = board.columns.map((item, index) => ({
    ...item.toObject(),
    order: index,
  }));

  await board.save();

  return { deleted: true, columnId };
};

export const deleteBoard = async (projectId, boardId, userId) => {
  await assertProjectAccess(projectId, userId);

  const board = await Board.findOne({
    _id: boardId,
    projectId,
  });

  if (!board) {
    throw new AppError('Board not found.', 404);
  }

  await board.deleteOne();
};
