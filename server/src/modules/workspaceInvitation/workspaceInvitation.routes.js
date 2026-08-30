import { Router } from 'express';

import { userAuth, validate } from '../../middlewares/authMiddleware.js';

import {
  createWorkspaceInvitationController,
  acceptWorkspaceInvitationController,
} from './workspaceInvitation.controller.js';

import {
  createWorkspaceInvitationSchema,
  acceptWorkspaceInvitationSchema,
} from '../../validators/workspaceInvitation.validation.js';

const router = Router();

router.post(
  '/invitations/accept',
  userAuth,
  validate(acceptWorkspaceInvitationSchema),
  acceptWorkspaceInvitationController,
);

router.post(
  '/:workspaceId/invitations',
  userAuth,
  validate(createWorkspaceInvitationSchema),
  createWorkspaceInvitationController,
);

export default router;

