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

router.get('/invitations/accept', userAuth, (req, res, next) => {
  const inviteToken = req.cookies?.inviteToken ?? req.query?.inviteToken;

  const result = acceptWorkspaceInvitationSchema.safeParse({ inviteToken });

  if (!result.success) {
    return next(result.error);
  }

  req.body = result.data;
  return acceptWorkspaceInvitationController(req, res, next);
});

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

