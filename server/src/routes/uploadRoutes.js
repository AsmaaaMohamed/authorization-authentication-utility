/**
 * File: src/routes/uploadRoutes.js
 * Description: Express router defining endpoints for Cloudinary image uploads, avatar optimization, on-the-fly transformations, metadata retrieval, and deletions.
 * 
 * Steps:
 * 1. Instantiates Express router.
 * 2. Maps POST /upload with uploadSingleImage middleware to uploadImage controller.
 * 3. Maps POST /avatar with uploadSingleImage middleware to uploadAvatar controller.
 * 4. Maps GET /transform and GET /transform/*publicId to getTransformedUrl controller.
 * 5. Maps GET /metadata and GET /metadata/*publicId to getImageMetadata controller.
 * 6. Maps DELETE / and DELETE /*publicId to deleteImage controller.
 * 7. Exports router for mounting at /api/image and /api/upload.
 */

import express from 'express';
import {
  uploadImage,
  uploadAvatar,
  getTransformedUrl,
  deleteImage,
  getImageMetadata,
} from '../controllers/uploadController.js';
import { uploadSingleImage } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', uploadSingleImage('image'), uploadImage);
router.post('/avatar', uploadSingleImage('image'), uploadAvatar);
router.get('/transform', getTransformedUrl);
router.get('/transform/*publicId', getTransformedUrl);
router.get('/metadata', getImageMetadata);
router.get('/metadata/*publicId', getImageMetadata);
router.delete('/', deleteImage);
router.delete('/*publicId', deleteImage);

export default router;
