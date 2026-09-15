import express from 'express';
import {
  deleteImage,
  getImageMetadata,
  getTransformedUrl,
  uploadAvatar,
  uploadImage,
} from './upload.controller.js';
import { uploadSingleImage } from '../../middlewares/uploadMiddleware.js';
import { userAuth } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// here
router.post('/upload', userAuth, uploadSingleImage('image'), uploadImage);
router.post('/avatar', userAuth, uploadSingleImage('image'), uploadAvatar);

router.get('/transform', userAuth, getTransformedUrl);
router.get('/transform/*publicId', userAuth, getTransformedUrl);
router.get('/metadata', userAuth, getImageMetadata);
router.get('/metadata/*publicId', userAuth, getImageMetadata);
router.delete('/', userAuth, deleteImage);
router.delete('/*publicId', userAuth, deleteImage);

export default router;
