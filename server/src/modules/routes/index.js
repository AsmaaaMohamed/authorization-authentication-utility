import express from 'express';

import authRoutes from '../auth/auth.routes.js';
import userRoutes from '../user/user.routes.js';
import uploadRoutes from '../upload/upload.routes.js';
import projectRoutes from '../project/project.routes.js';
import workspaceRoutes from '../workspace/workspace.routes.js';
import workspaceInvitationRoutes from '../workspaceInvitation/workspaceInvitation.routes.js';
import taskTagRoutes from '../taskTag/taskTag.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/projects', projectRoutes);
router.use('/workspace', workspaceRoutes);
router.use('/workspace', workspaceInvitationRoutes);

router.use('/upload', uploadRoutes);

router.use('/', taskTagRoutes);

export default router;