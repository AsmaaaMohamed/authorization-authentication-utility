import express from 'express';
import * as authController from './auth.controller.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../../validators/authValidator.js';

import { validate } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', validate(registerUserSchema), authController.register);

router.post('/login', validate(loginUserSchema), authController.login);

export default router;
