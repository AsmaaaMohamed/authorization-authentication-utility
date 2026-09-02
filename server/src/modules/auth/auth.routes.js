import express from 'express';
import * as authController from './auth.controller.js';
import * as validationSchema from '../../validators/authValidator.js';

import { validate, userAuth } from '../../middlewares/authMiddleware.js';
import { limiter, RATE_LIMITS } from '../../utilities/rateLimiter.js';
const router = express.Router();

router.post(
  '/register',
  limiter(RATE_LIMITS.REGISTER),
  validate(validationSchema.registerUserSchema),
  authController.register,
);

router.post(
  '/login',
  limiter(RATE_LIMITS.LOGIN),
  validate(validationSchema.loginUserSchema),
  authController.login,
);
router.post(
  '/verify-email',
  validate(validationSchema.verifyResetOtpSchema),
  authController.verifyEmail,
);
router.post(
  '/refresh',
  limiter(RATE_LIMITS.REFRESH_TOKEN),
  authController.refresh,
);
router.post('/logout', userAuth, authController.logout);
router.post('/logout-all', userAuth, authController.logoutAllDevices);

router.post(
  '/forgot-password',
  validate(validationSchema.forgotPasswordSchema),
  authController.forgotPassword,
);

router.post(
  '/verify-otp',
  validate(validationSchema.verifyResetOtpSchema),
  authController.verifyResetOtp,
);

router.post(
  '/reset-password',
  validate(validationSchema.resetPasswordSchema),
  authController.resetPassword,
);

export default router;
