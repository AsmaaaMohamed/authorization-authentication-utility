import express from "express";
import { login, register } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.validator.js";
import { validate } from "../../middlewares/validationMiddleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
