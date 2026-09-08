import { Router } from 'express';

import {
  userAuth,
  authorize,
  validate,
} from '../../middlewares/authMiddleware.js';

import {
  createWorkspaceTag,
} from './workspaceTag.controller.js';

import {
  createWorkspaceTagSchema,
} from './workspaceTag.validation.js';

const router = Router();

router.post(
  '/workspaces/:workspaceId/tags',

  userAuth,

  authorize('Admin', 'Owner'),

  validate(createWorkspaceTagSchema),

  createWorkspaceTag,
);

export default router;