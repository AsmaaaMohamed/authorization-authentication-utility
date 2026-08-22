/**
 * File: src/config/cloudinary.js
 * Description: Cloudinary v2 SDK configuration module for secure image uploads and asset transformations.
 * 
 * Steps:
 * 1. Imports Cloudinary v2 SDK and loads environment variables.
 * 2. Configures cloud_name, api_key, api_secret, and enables HTTPS delivery.
 * 3. Exports the configured Cloudinary instance for service operations.
 */

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
  secure: true,
});

export default cloudinary;
