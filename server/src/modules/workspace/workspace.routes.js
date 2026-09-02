import { Router } from 'express';

import {
  createWorkspaceController,
  getMyWorkspacesController,
  updateWorkspaceController,
  deleteWorkspaceController,
  getWorkspaceMembersController,
} from './workspace.controller.js';

import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from '../../validators/workspace.validation.js';

import { validate } from '../../middlewares/authMiddleware.js';
import { userAuth } from '../../middlewares/authMiddleware.js';

const router = Router();

router.post(
  '/',
  userAuth,
  validate(createWorkspaceSchema),
  createWorkspaceController,
);

router.get('/', userAuth, getMyWorkspacesController);

router.get('/:workspaceId/members', userAuth, getWorkspaceMembersController);

router.patch(
  '/:id',
  userAuth,
  validate(updateWorkspaceSchema),
  updateWorkspaceController,
);

router.delete('/:id', userAuth, deleteWorkspaceController);

export default router;
