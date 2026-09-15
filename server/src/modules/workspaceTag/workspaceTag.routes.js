import { Router } from 'express';

import {
  userAuth,
  authorize,
  validate,
} from '../../middlewares/authMiddleware.js';

import { createWorkspaceTag } from './workspaceTag.controller.js';

import { createWorkspaceTagSchema } from '../../validators/workspaceTag.validation.js';

const router = Router();

router.post(
  '/workspaces/:workspaceId/tags',

  userAuth,

  authorize('admin'),

  validate(createWorkspaceTagSchema),

  createWorkspaceTag,
);

export default router;
