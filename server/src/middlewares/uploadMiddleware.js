/**
 * File: src/middlewares/uploadMiddleware.js
 * Description: Multer middleware configuration for in-memory image streaming, MIME type validation, file size limits, and error handling.
 * 
 * Steps:
 * 1. Configures multer.memoryStorage() to buffer incoming image files in RAM for direct Cloudinary streaming.
 * 2. Defines MIME-type whitelist (JPEG, JPG, PNG, WEBP, GIF) and validation filter callback.
 * 3. Enforces single-file and 5MB maximum file size constraints.
 * 4. Provides uploadSingleImage wrapper to intercept MulterError exceptions (e.g. LIMIT_FILE_SIZE) and return clear 400 Bad Request JSON responses.
 * 5. Exports upload instance and uploadSingleImage middleware function.
 */

import multer from "multer";

const storage = multer.memoryStorage();
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(
      "Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed."
    );
    error.code = "INVALID_FILE_TYPE";
    cb(error, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter,
});

export const uploadSingleImage = (fieldName = "image") => {
  const multerMiddleware = upload.single(fieldName);

  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
              success: false,
              message: "File size exceeds the 5MB limit.",
            });
          }
          return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`,
          });
        }

        if (err.code === "INVALID_FILE_TYPE") {
          return res.status(400).json({
            success: false,
            message: err.message,
          });
        }

        return res.status(400).json({
          success: false,
          message: err.message || "Error uploading file.",
        });
      }

      next();
    });
  };
};

export default upload;
