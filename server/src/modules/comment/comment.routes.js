import express from 'express';
import {addTaskComment,getTaskComment,editTaskComment,deleteTaskComment} from '../comment/comment.controller.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';
const router = express.Router();

router.post(
  '/:taskId/comments',
  verifyToken,
  addTaskComment,
);
router.get(
  '/:taskId/comments',
  verifyToken,
  getTaskComment,
);
router.patch(
  '/:taskId/comments/:commentId',
  verifyToken,
  editTaskComment,
);
router.delete(
  '/:taskId/comments/:commentId',
  verifyToken,
  deleteTaskComment,
);
export default router;