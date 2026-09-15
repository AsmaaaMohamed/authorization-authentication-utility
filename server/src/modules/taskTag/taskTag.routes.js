import express from 'express';
import { userAuth } from '../../middlewares/authMiddleware.js';
import {
  addTagToTask,
  removeTagFromTask,
  getTasksByTag,
} from './taskTag.controller.js';

const router = express.Router();

router.post('/tasks/:taskId/tags/:tagId', userAuth, addTagToTask);
router.delete('/tasks/:taskId/tags/:tagId', userAuth, removeTagFromTask);
router.get('/workspaces/:workspaceId/tags/:tagId/tasks', userAuth, getTasksByTag);

export default router;
