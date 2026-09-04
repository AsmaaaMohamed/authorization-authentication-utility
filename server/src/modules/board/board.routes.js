import express from 'express';

import * as boardController from './board.controller.js';

import { userAuth, validate } from '../../middlewares/authMiddleware.js';

import {
  createBoardBodySchema,
  updateBoardBodySchema,
} from '../../validators/board.validator.js';

const router = express.Router();

router.use(userAuth);

router.post(
  '/:projectId/boards',
  validate(createBoardBodySchema),
  boardController.createBoard,
);

router.get('/:projectId/boards', boardController.listProjectBoards);

router.patch(
  '/:projectId/boards/:boardId',
  validate(updateBoardBodySchema),
  boardController.updateBoard,
);

router.delete('/:projectId/boards/:boardId', boardController.deleteBoard);

export default router;
