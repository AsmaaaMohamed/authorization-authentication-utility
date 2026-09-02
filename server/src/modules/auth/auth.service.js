import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './auth.model.js';
import { findByEmail } from './auth.model.js';
import AppError from '../../utilities/AppError.js';
import RefreshToken from '../token/refreshToken.model.js';
import * as refreshTokenService from '../token/refreshToken.services.js';
import * as redisService from '../../config/redisService.js';

// helper functions
const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  avatar: user.avatar,
});

// signs access token
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_ACCESS_TOKEN_SECRET || 'jwt_secret_key_default',
    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN },
  );
};

/**
 * Signup a new user
 * @param {object} userData
 * @returns {Promise<User>}
 */

export const signupUser = async (userData) => {
  const existingUser = await findByEmail(userData.email);

  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  // create user
  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    passwordConfirm: userData.passwordConfirm,
    isVerified: false,
  });

  // send verification email using bullmq and redis

  return sanitizeUser(newUser);
};
/**
 *Verify User Account
 */

export const verifyUserAccount = async (userId) => {
  // check existence
};

/**
 * Login user
 * @param {object} userData
 * @param {string} userData.email - User's email address.
 * @param {string} userData.password - User's plaintext password
 * @returns {Promise<{ user: User, accessToken: string, refreshToken: string, refreshTokenExpiresAt: Date }>}
 *   Resolves with the authenticated user and issued tokens.
 * @throws {AppError} If credentials are invalid or the user does not exist.
 */

export const loginUser = async (userData) => {
  const user = await findByEmail(userData.email);

  if (!user || !(await bcrypt.compare(userData.password, user.password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (!user.isVerified) {
    throw new AppError('Please verify your email address to login.', 401);
  }

  const { refreshToken, expiresAt } =
    await refreshTokenService.createRefreshToken(user._id);

  return {
    user: sanitizeUser(user),
    token: signToken(user),
    refreshToken,
    refreshTokenExpiresAt: expiresAt,
  };
};

/**
 * Rotates a refresh token: validates it, detects reuse/theft, and issues
 * a new access/refresh token pair.
 *
 * Reuse detection: if the token has already been revoked (i.e. it was
 * already rotated once before) and the rotation didn't happen within the
 * last 10 seconds (grace window for race conditions/retries), the entire
 * token family is revoked, since this indicates a stolen/replayed token.
 *
 * @param {string} refreshToken - Raw refresh token (unhashed) from the client.
 * @returns {Promise<{
 *   user: object,
 *   token: string,
 *   newRefreshToken: string,
 *   refreshTokenExpiresAt: Date
 * }>} The sanitized user, a new access token, and the rotated refresh token.
 *
 * @throws {AppError} 401 - If `refreshToken` is missing.
 * @throws {AppError} 403 - If the token hash is blacklisted (reuse detected).
 * @throws {AppError} 403 - If no matching stored token is found (invalid token).
 * @throws {AppError} 403 - If the stored token was already revoked (reuse/theft detected).
 * @throws {AppError} 401 - If the stored token has expired.
 * @throws {AppError} 401 - If the user associated with the token no longer exists.
 */

export const refreshUser = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError('Refresh token required!', 401);
  }

  const tokenHash = refreshTokenService.hashToken(refreshToken);

  if (await redisService.isTokenBlacklisted(tokenHash)) {
    throw new AppError('Token reuse detected! Login required', 403);
  }

  const storedToken = await RefreshToken.findOne({ tokenHash });

  if (!storedToken) {
    throw new AppError('Invalid refresh token!', 403);
  }

  if (storedToken.revoked) {
    const rotatedRecently =
      storedToken.updatedAt &&
      Date.now() - storedToken.updatedAt.getTime() < 10_000;

    if (!rotatedRecently) {
      await refreshTokenService.revokeTokenFamily(storedToken.familyId);
    }

    throw new AppError('Token reuse detected! Login required.', 403);
  }

  if (storedToken.expiresAt.getTime() < Date.now()) {
    await refreshTokenService.revokeTokenFamily(storedToken.familyId);

    throw new AppError('Refresh token expired. Login required.', 401);
  }

  const user = await User.findById(storedToken.userId);
  if (!user) {
    throw new AppError('User not found', 401);
  }

  const { newRefreshToken, expiresAt } =
    await refreshTokenService.rotateRefreshToken(storedToken);

  const newAccessToken = signToken(user);

  return {
    user: sanitizeUser(user),
    token: newAccessToken,
    newRefreshToken,
    refreshTokenExpiresAt: expiresAt,
  };
};

/**
 * Logs out a user by revoking their refresh token and blacklisting
 * their current access token, so neither can be used again even
 * though the access token's signature is still cryptographically valid.
 * @param {string} [refreshToken] - Raw refresh token from the client (e.g. cookie).
 *   If provided and a matching, non-revoked stored token is found, it is revoked.
 * @param {string} [accessToken] - Raw access token (JWT) from the client.
 *   If provided and still valid, it is added to the Redis blacklist for its
 *   remaining lifetime, so it's rejected on future requests despite a valid signature.
 * @returns {Promise<void>}
 */

export const logoutUser = async (refreshToken, accessToken) => {
  if (refreshToken) {
    const storedToken = await RefreshToken.findOne({
      tokenHash: refreshTokenService.hashToken(refreshToken),
    });

    if (storedToken && !storedToken.revoked) {
      await refreshTokenService.revokeToken(storedToken);
    }
  }

  if (accessToken) {
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_TOKEN_SECRET || 'jwt_secret_key_default',
      );

      const secondsLeft = Math.max(
        1,
        decoded.exp - Math.floor(Date.now() / 1000),
      );

      await redisService.blacklistToken(accessToken, secondsLeft);
    } catch (err) {
      // already expired/invalid — nothing to blacklist
    }
  }
};

/**
 * Logs out a user from all devices by revoking every active refresh
 * token session (family) belonging to them, and setting a per-user
 * revocation cutoff so any still-valid access tokens are rejected
 * immediately rather than remaining usable until they naturally expire.
 *
 * @param {string} userId - ID of the user to log out everywhere.
 * @returns {Promise<void>}
 */

export const logoutUserFromAllDevices = async (userId) => {
  await refreshTokenService.revokeTokenUser(userId);
};
