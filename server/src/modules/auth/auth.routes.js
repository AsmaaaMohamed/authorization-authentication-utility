import express from 'express';
import * as authController from './auth.controller.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../../validators/authValidator.js';

import { validate, userAuth } from '../../middlewares/authMiddleware.js';
import { limiter, RATE_LIMITS } from '../../utilities/rateLimiter.js';
const router = express.Router();

router.post(
  '/register',
  limiter(RATE_LIMITS.REGISTER),
  validate(registerUserSchema),
  authController.register,
);

router.post(
  '/login',
  limiter(RATE_LIMITS.LOGIN),
  validate(loginUserSchema),
  authController.login,
);

router.post(
  '/refresh',
  limiter(RATE_LIMITS.REFRESH_TOKEN),
  authController.refresh,
);
router.post('/logout', userAuth, authController.logout);
router.post('/logout-all', userAuth, authController.logoutAllDevices);

export default router;
