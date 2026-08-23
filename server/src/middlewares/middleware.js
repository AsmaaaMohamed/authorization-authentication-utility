/**
 * File: src/middlewares/middleware.js
 * Description: Barrel export module consolidating authentication, authorization, and upload middlewares for centralized imports.
 * 
 * Steps:
 * 1. Re-exports all authentication and RBAC guards from authMiddleware.js.
 * 2. Re-exports all Multer upload processing and error handling from uploadMiddleware.js.
 */

export * from "./authMiddleware.js";
export * from "./uploadMiddleware.js";
