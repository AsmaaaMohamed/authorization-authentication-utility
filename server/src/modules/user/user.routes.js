import express from "express";
import { getAdminDashboard, getUserData } from "./user.controller.js";
import { authorize, userAuth } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/data", userAuth, getUserData);
router.get("/admin-only", userAuth, authorize("admin"), getAdminDashboard);

export default router;
