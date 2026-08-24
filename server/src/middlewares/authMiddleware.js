/**
 * File: src/middlewares/authMiddleware.js
 * Description: Authentication and Role-Based Access Control (RBAC) middleware for protecting Express routes.
 *
 * Steps:
 * 1. userAuth function extracts JWT tokens from HTTP-only cookies, Authorization Bearer header, or custom token header.
 * 2. Checks token revocation status against Redis blacklist via isTokenBlacklisted service.
 * 3. Verifies token cryptographic signature and expiration timestamp using process.env.JWT_SECRET.
 * 4. Attaches decoded user payload ({ id, role, email }) to req.user and sets req.body.userId.
 * 5. Handles TokenExpiredError and invalid signature errors with clean 401 Unauthorized JSON responses.
 * 6. authorize function enforces role-based route guarding by comparing req.user.role with permitted roles, returning 403 Forbidden on mismatches.
 */

import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../config/redisService.js";

export const userAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.headers.token) {
      token = req.headers.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Token is missing, please log in.",
      });
    }

    const isRevoked = await isTokenBlacklisted(token);
    if (isRevoked) {
      return res.status(401).json({
        success: false,
        message: "Session has been invalidated. Please log in again.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "jwt_secret_key_default",
    );

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Invalid token payload.",
      });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role || "user",
      email: decoded.email || "",
    };

    req.body = req.body || {};
    req.body.userId = decoded.id;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token signature. Authentication failed.",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required before authorization check.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized to access this resource. Required role(s): [${roles.join(", ")}].`,
      });
    }

    next();
  };
};

export default userAuth;
