
import express from 'express';
import { createProject, deleteProject , getWorkspaceProjects } from './project.controller.js';
import { createProjectSchema } from '../../validators/projectValidator.js';
import { validate, userAuth } from '../../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/:workspaceId/projects', validate(createProjectSchema), createProject);
router.delete('/:projectId', userAuth, deleteProject);
router.get(
  "/workspaces/:id/projects",
  getWorkspaceProjects
);


export default router;
