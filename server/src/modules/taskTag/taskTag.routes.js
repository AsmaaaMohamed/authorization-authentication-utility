import express from 'express';
import {
	addTagToTask,
	removeTagFromTask,
	getTasksByTag,
} from './taskTag.controller.js';

const router = express.Router();

router.post('/tasks/:id/tags/:tagId', addTagToTask);
router.delete('/tasks/:id/tags/:tagId', removeTagFromTask);
router.get('/workspaces/:id/tags/:tagId/tasks', getTasksByTag);

export default router;