import express from 'express';
import { createProject, deleteProject } from './project.controller.js';
import { createProjectSchema } from '../../validators/projectValidator.js';
import { validate, userAuth } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', validate(createProjectSchema), createProject);
router.post('/:workspaceId/projects', validate(createProjectSchema), createProject);
router.delete('/:projectId', userAuth, deleteProject);

export default router;
