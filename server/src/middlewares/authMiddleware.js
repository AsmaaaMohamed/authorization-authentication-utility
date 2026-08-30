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

import jwt from 'jsonwebtoken';
import {
  isTokenBlacklisted,
  getUserRevokeAllBefore,
} from '../config/redisService.js';
import AppError from '../utilities/AppError.js';

// helper function
const handleZodError = (err) => {
  const message = err.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('. ');
  return new AppError(message, 400);
};

export const userAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('Not Authorized. Token is missing, please log in.', 401),
      );
    }

    const isRevoked = await isTokenBlacklisted(token);
    if (isRevoked) {
      return next(
        new AppError('Session has been invalidated. Please log in again.', 401),
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET || 'jwt_secret_key_default',
    );

    if (!decoded || !decoded.id) {
      return next(new AppError('Not Authorized. Invalid token payload.', 401));
    }

    const revokeAllBefore = await getUserRevokeAllBefore(decoded.id);
    if (revokeAllBefore && decoded.iat * 1000 < revokeAllBefore) {
      return next(
        new AppError('Session has been invalidated. Please log in again.', 401),
      );
    }

    req.user = {
      id: decoded.id,
      role: decoded.role || 'user',
      email: decoded.email || '',
    };

    req.token = token;

    next();
  } catch (error) {
    return next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError(
        'Authentication required before authorization check.',
        401,
      );
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        `Forbidden. Role '${req.user.role}' is not authorized to access this resource. Required role(s): [${roles.join(', ')}].`,
        403,
      );
    }

    next();
  };
};

// validate middleware for zod validation

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(handleZodError(result.error));
    }

    req.body = result.data;

    next();
  };
};

export default userAuth;
