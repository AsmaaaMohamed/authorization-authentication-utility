const express = require("express");

const authRoutes = require("../auth/auth.routes");
const userRoutes = require("../user/user.routes");
const uploadRoutes = require("../upload/upload.routes");
const imageRoutes = require("../image/image.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

// the following two routes are for image upload and retrieval
router.use("/upload", uploadRoutes);
router.use("/image", imageRoutes);

module.exports = router;
