import Board from './board.model.js';
import Project from '../project/project.model.js';
import WorkspaceMember from '../workspaceMember/workspaceMember.model.js';
import AppError from '../../utilities/AppError.js';

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
  await assertProjectAccess(projectId, userId);

  try {
    return await Board.create({
      name,
      projectId,
      createdBy: userId,
    });
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

  return Board.find({ projectId }).sort({ createdAt: -1 });
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

  // Only allow fields that are actually editable.
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

  return board;
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
