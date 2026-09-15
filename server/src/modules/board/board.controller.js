import * as boardService from './board.service.js';

export const createBoard = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { name } = req.body;

    const board = await boardService.createBoard(projectId, req.user.id, name);

    res.status(201).json({
      status: 'success',
      data: { board },
    });
  } catch (err) {
    next(err);
  }
};

export const listProjectBoards = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const boards = await boardService.listProjectBoards(projectId, req.user.id);

    res.status(200).json({
      status: 'success',
      results: boards.length,
      data: { boards },
    });
  } catch (err) {
    next(err);
  }
};

export const updateBoard = async (req, res, next) => {
  try {
    const { projectId, boardId } = req.params;

    const board = await boardService.updateBoard(
      projectId,
      boardId,
      req.user.id,
      req.body,
    );

    res.status(200).json({
      status: 'success',
      data: { board },
    });
  } catch (err) {
    next(err);
  }
};

export const addBoardColumn = async (req, res, next) => {
  try {
    const { projectId, boardId } = req.params;
    const column = await boardService.addBoardColumn(
      projectId,
      boardId,
      req.user.id,
      req.body,
    );

    res.status(201).json({
      status: 'success',
      data: { column },
    });
  } catch (err) {
    next(err);
  }
};

export const updateBoardColumn = async (req, res, next) => {
  try {
    const { projectId, boardId, columnId } = req.params;
    const column = await boardService.updateBoardColumn(
      projectId,
      boardId,
      columnId,
      req.user.id,
      req.body,
    );

    res.status(200).json({
      status: 'success',
      data: { column },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBoardColumn = async (req, res, next) => {
  try {
    const { projectId, boardId, columnId } = req.params;

    await boardService.deleteBoardColumn(projectId, boardId, columnId, req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Column deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBoard = async (req, res, next) => {
  try {
    const { projectId, boardId } = req.params;

    await boardService.deleteBoard(projectId, boardId, req.user.id);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
