import { Worker } from 'bullmq';
import { redisClient } from '../config/redis.js';
import { sendMail } from '../utilities/mailer.js';
import { logger } from '../utilities/logger.js';
import AppError from '../utilities/appError.js';
import * as redisService from '../config/redisService.js';

// todo: refactor the email worker to handle different types of email - To Be General not coupled with OTP verification only. For example, welcome email, password reset email,
// etc. The worker should be able to handle different types of email jobs based on the job data passed to it.
// Create a BullMQ worker to process email jobs
const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    const { to, subject, text, html, otp, purpose = 'otp' } = job.data;
    const OTP_TTL_MINUTES =
      Number(process.env.OTP_VERIFICATION_EXPIRATION) || 10;
    try {
      // set otp in redis
      await redisService.setOtp(to, otp, {
        ttlSeconds: OTP_TTL_MINUTES * 60,
        maxAttempts: 3,
        purpose,
      });

      // send Email using the sendMail function and background job processing
      await sendMail({ to, subject, text, html });

      // todo:generate jwt token and send to user to not make the user provide the email again
    } catch (error) {
      logger.error('Error occurred while sending email:', error);
      throw new AppError(error.message, 500); // Rethrow the error to let BullMQ handle retries if needed
    }
  },
  { connection: redisClient },
);

emailWorker.on('completed', (job) => {
  logger.info(`Email job completed: ${job.id}`);
});

emailWorker.on('failed', (job, err) => {
  logger.error(`Email job failed: ${job.id}, Error: ${err.message}`);
});

emailWorker.on('progress', (job, progress) => {
  logger.info(`Email job progress: ${job.id}, Progress: ${progress}`);
});

emailWorker.on('error', (err) => {
  logger.error(`Email worker error: ${err.message}`);
});

export default emailWorker;
