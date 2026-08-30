import express from 'express';
import authRoutes from '../auth/auth.routes.js';
import userRoutes from '../user/user.routes.js';
import uploadRoutes from '../upload/upload.routes.js';
import projectRoutes from '../project/project.routes.js';
import workspaceRoutes from '../workspace/workspace.routes.js';
import workspaceInvitationRoutes from '../workspaceInvitation/workspaceInvitation.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/projects', projectRoutes);
router.use('/workspace', workspaceRoutes);
router.use('/workspace', workspaceInvitationRoutes);

// the following two routes are for image upload and retrieval
router.use('/upload', uploadRoutes);

export default router;
