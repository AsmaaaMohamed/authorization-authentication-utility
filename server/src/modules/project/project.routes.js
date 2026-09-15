import express from 'express';
import {
  createProject,
  deleteProject,
  getWorkspaceProjects,
  updateProject,
} from './project.controller.js';
import { createProjectSchema } from '../../validators/projectValidator.js';
import { validate, userAuth } from '../../middlewares/authMiddleware.js';
import { updateProjectSchema } from '../../validators/projectValidator.js';

const router = express.Router();

router.post(
  '/:workspaceId/projects',
  userAuth,
  validate(createProjectSchema),
  createProject,
);
router.delete('/:projectId', userAuth, deleteProject);
router.get('/workspaces/:id/projects', userAuth, getWorkspaceProjects);
router.patch(
  '/:id/project',
  userAuth,
  validate(updateProjectSchema),
  updateProject,
);

export default router;
