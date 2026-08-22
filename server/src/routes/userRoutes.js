/**
 * File: src/routes/userRoutes.js
 * Description: Express router defining protected endpoints for authenticated user data retrieval and RBAC admin-guarded routes.
 * 
 * Steps:
 * 1. Instantiates Express router.
 * 2. Maps GET /data protected by userAuth middleware to getUserData controller.
 * 3. Maps GET /admin-only protected by userAuth and authorize('admin') to getAdminDashboard controller.
 * 4. Exports router for mounting at /api/user.
 */

import express from 'express';
import { getUserData, getAdminDashboard } from '../controllers/userController.js';
import { userAuth, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/data', userAuth, getUserData);
router.get('/admin-only', userAuth, authorize('admin'), getAdminDashboard);

export default router;
