import { Router } from 'express';
import { userAuth, validate } from '../../middlewares/authMiddleware.js';
import {
  createTaskController,
  getBoardTasksController,
  getTaskDetailsController,
  updateTaskController,
  deleteTaskController,
} from './task.controller.js';
import {
  createTaskSchema,
  updateTaskSchema,
} from '../../validators/task.validator.js';

const router = Router();

router.post(
  '/',
  userAuth,
  validate(createTaskSchema),
  createTaskController,
);

router.get('/boards/:boardId', userAuth, getBoardTasksController);
router.get('/:id', userAuth, getTaskDetailsController);
router.get('/', userAuth, getBoardTasksController);

router.patch(
  '/:id',
  userAuth,
  validate(updateTaskSchema),
  updateTaskController,
);

router.delete('/:id', userAuth, deleteTaskController);

export default router;




