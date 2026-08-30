import express from 'express';
import * as authController from './auth.controller.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../../validators/authValidator.js';

import { validate, userAuth } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', validate(registerUserSchema), authController.register);

router.post('/login', validate(loginUserSchema), authController.login);

router.post('/refresh', authController.refresh);
router.post('/logout', userAuth, authController.logout);
router.post('/logout-all', userAuth, authController.logoutAllDevices);

export default router;
