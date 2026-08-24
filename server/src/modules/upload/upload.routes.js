import express from "express";
import {
  deleteImage,
  getImageMetadata,
  getTransformedUrl,
  uploadAvatar,
  uploadImage,
} from "./upload.controller.js";
import { uploadSingleImage } from "../../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", uploadSingleImage("image"), uploadImage);
router.post("/avatar", uploadSingleImage("image"), uploadAvatar);
router.get("/transform", getTransformedUrl);
router.get("/transform/*publicId", getTransformedUrl);
router.get("/metadata", getImageMetadata);
router.get("/metadata/*publicId", getImageMetadata);
router.delete("/", deleteImage);
router.delete("/*publicId", deleteImage);

export default router;
