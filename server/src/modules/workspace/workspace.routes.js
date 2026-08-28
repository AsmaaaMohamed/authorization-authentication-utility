import { Router } from 'express';

import { createWorkspaceController } from './workspace.controller.js';
import { createWorkspaceSchema } from '../../validators/workspace.validation.js';
import { validate } from '../../middlewares/authMiddleware.js';
import protect from '../../middlewares/authMiddleware.js';

const router = Router();

router.post(
  '/',
  protect,
  validate(createWorkspaceSchema),
  createWorkspaceController,
);

export default router;
