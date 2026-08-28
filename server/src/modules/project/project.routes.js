
import express from "express";

import {
  getWorkspaceProjects,
} from "./project.controller.js";


const router = express.Router();

router.get(
  "/workspaces/:id/projects",
  getWorkspaceProjects
);


export default router;

