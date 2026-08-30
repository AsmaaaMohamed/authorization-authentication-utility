import { Router } from 'express';

import { userAuth } from '../../middlewares/authMiddleware.js';
import { validate } from '../../middlewares/authMiddleware.js';

import { createWorkspaceInvitationController } from './workspaceInvitation.controller.js';

import { createWorkspaceInvitationSchema } from '../../validators/workspaceInvitation.validation.js';

const router = Router();

router.post(
  '/:workspaceId/invitations',
  userAuth,
  validate(createWorkspaceInvitationSchema),
  createWorkspaceInvitationController,
);

export default router;
