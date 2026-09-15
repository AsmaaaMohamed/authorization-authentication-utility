import { Worker } from 'bullmq';
import { redisClient } from '../config/redis.js';
import { logger } from '../utilities/logger.js';
import AppError from '../utilities/AppError.js';
import { sendWorkspaceInvitationEmail } from '../utilities/mailer.js';

const WORKSPACE_INVITATION_QUEUE = 'workspaceInvitationQueue';

const workspaceInvitationWorker = new Worker(
  WORKSPACE_INVITATION_QUEUE,
  async (job) => {
    const { to, workspaceName, inviterName, token } = job.data;

    try {
      await sendWorkspaceInvitationEmail({
        to,
        workspaceName,
        inviterName,
        token,
      });
    } catch (error) {
      logger.error('Invitation email job failed:', error);
      throw new AppError(error.message || 'Failed to send workspace invitation email', 500);
    }
  },
  { connection: redisClient },
);

workspaceInvitationWorker.on('completed', (job) => {
  logger.info(`Invitation email job completed: ${job.id}`);
});

workspaceInvitationWorker.on('failed', (job, err) => {
  logger.error(`Invitation email job failed: ${job.id}, Error: ${err.message}`);
});

workspaceInvitationWorker.on('error', (err) => {
  logger.error(`Workspace invitation worker error: ${err.message}`);
});

export default workspaceInvitationWorker;
