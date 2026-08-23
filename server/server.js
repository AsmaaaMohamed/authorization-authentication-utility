/**
 * File: server.js
 * Description: Main Express application entry point that initializes databases, core middleware, Swagger API documentation, and route controllers.
 * 
 * Steps:
 * 1. Imports environment variables, express framework, security/cookie middlewares, and database connectors.
 * 2. Initializes database connections for MongoDB (Mongoose) and Redis cache.
 * 3. Configures global middlewares for JSON request body parsing, CORS with credentials, and Cookie Parser.
 * 4. Mounts the interactive Swagger UI documentation at /api-docs.
 * 5. Registers application route modules for user management (/api/user) and Cloudinary image handling (/api/image, /api/upload).
 * 6. Starts the HTTP web server listening on the configured PORT (default: 5000).
 */

import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import connectDB from "./src/config/mongodb.js";
import { connectRedis } from "./src/config/redis.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import { setupSwagger } from "./src/docs/swagger.js";

const app = express();
const port = process.env.PORT || 5000;

connectDB();
connectRedis();

app.use(express.json());
app.use(cors({ credentials: true }));
app.use(cookieParser());

setupSwagger(app);

app.use("/api/user", userRoutes);
app.use("/api/image", uploadRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Server is running. API Documentation available at /api-docs");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  console.log(`Swagger Documentation available at http://localhost:${port}/api-docs`);
});