import { Router } from 'express';

import {
  userAuth,
  authorize,
  validate,
} from '../../middlewares/authMiddleware.js';

import {
  createWorkspaceTag,
  listWorkspaceTags,
  deleteWorkspaceTag,
} from './workspaceTag.controller.js';

import { createWorkspaceTagSchema } from '../../validators/workspaceTag.validation.js';

const router = Router();

router.post(
  '/workspaces/:workspaceId/tags',
  userAuth,
  authorize(),
  validate(createWorkspaceTagSchema),
  createWorkspaceTag,
);

router.get(
  '/workspaces/:workspaceId/tags',
  userAuth,
  authorize(),
  listWorkspaceTags,
);

router.delete(
  '/workspaces/:workspaceId/tags/:tagId',
  userAuth,
  authorize(),
  deleteWorkspaceTag,
);

export default router;
