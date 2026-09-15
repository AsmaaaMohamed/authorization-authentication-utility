import express from 'express';
import {
  addTaskComment,
  getTaskComment,
  editTaskComment,
  deleteTaskComment,
} from '../comment/comment.controller.js';
import { userAuth } from '../../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/:taskId/comments', userAuth, addTaskComment);
router.get('/:taskId/comments', userAuth, getTaskComment);
router.patch('/:taskId/comments/:commentId', userAuth, editTaskComment);
router.delete('/:taskId/comments/:commentId', userAuth, deleteTaskComment);
export default router;
