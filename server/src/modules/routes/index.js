import express from 'express';

import authRoutes from '../auth/auth.routes.js';
import userRoutes from '../user/user.routes.js';
import uploadRoutes from '../upload/upload.routes.js';
import projectRoutes from '../project/project.routes.js';
import workspaceRoutes from '../workspace/workspace.routes.js';
import workspaceInvitationRoutes from '../workspaceInvitation/workspaceInvitation.routes.js';
import boardRoutes from '../board/board.routes.js';
import taskRoutes from '../task/task.routes.js';
import taskTagRoutes from '../taskTag/taskTag.routes.js';
import commentRoutes from '../comment/comment.routes.js';
import workspaceTagRoutes from '../workspaceTag/workspaceTag.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/user', userRoutes);

router.use('/projects', projectRoutes);

router.use('/workspace', workspaceRoutes);

router.use('/workspace', workspaceInvitationRoutes);

// router.use('/projects', workspaceInvitationRoutes);

router.use('/boards', boardRoutes);
router.use('/tasks', taskRoutes);
router.use('/tasks', commentRoutes);
router.use('/upload', uploadRoutes);
router.use('/', taskTagRoutes);
router.use('/', workspaceTagRoutes);

export default router;
