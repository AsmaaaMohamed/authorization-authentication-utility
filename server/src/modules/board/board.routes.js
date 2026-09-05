import { Router } from 'express';
import { userAuth } from '../../middlewares/authMiddleware.js';
import { getBoardTasksController } from '../task/task.controller.js';

const router = Router();

router.get('/:boardId/tasks', userAuth, getBoardTasksController);

export default router;
