// main Auth routes

import express from 'express';
import * as AuthController from '../controllers/auth.controller.js';
import { validate } from '../middlewares/middleware.js';
import { registerUserSchema } from '../validators/user.validator.js';

const router = express.Router();

// register endpoint
router.post('/register', validate(registerUserSchema), AuthController.register);

export default router;
