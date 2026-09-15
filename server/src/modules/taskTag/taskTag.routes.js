import express from 'express';
import { userAuth } from '../../middlewares/authMiddleware.js';
import {
  addTagToTask,
  removeTagFromTask,
  getTasksByTag,
} from './taskTag.controller.js';

const router = express.Router();

router.post('/tasks/:id/tags/:tagId', userAuth, addTagToTask);
router.delete('/tasks/:id/tags/:tagId', userAuth, removeTagFromTask);
router.get('/workspaces/:id/tags/:tagId/tasks', userAuth, getTasksByTag);

export default router;
