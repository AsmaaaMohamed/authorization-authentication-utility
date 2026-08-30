import crypto from 'crypto';
import RefreshToken from './refreshToken.model.js';
import * as redisServices from '../../config/redisService.js';

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const generateRefreshToken = () =>
  crypto.randomBytes(64).toString('hex');

export const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const generateFamilyId = () => crypto.randomBytes(32).toString('hex');

const secondsUntil = (date) =>
  Math.max(1, Math.floor((date.getTime() - Date.now()) / 1000));

export const createRefreshToken = async (userId) => {
  const refreshToken = generateRefreshToken();
  const tokenHash = hashToken(refreshToken);
  const familyId = generateFamilyId();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  await RefreshToken.create({
    userId,
    tokenHash,
    familyId,
    expiresAt,
  });

  return { refreshToken, expiresAt };
};

export const revokeToken = async (storedToken) => {
  if (!storedToken || storedToken.revoked) return;

  storedToken.revoked = true;
  await storedToken.save();

  // mark token as blacklisted
  await redisServices.blacklistToken(
    storedToken.tokenHash,
    secondsUntil(storedToken.expiresAt),
  );
};

// Soft-revoke (not delete) every active token in a family
export const revokeTokenFamily = async (familyId) => {
  const activeTokens = await RefreshToken.find({ familyId, revoked: false });
  await Promise.all(activeTokens.map((t) => revokeToken(t)));
};

// for logout from all devices
export const revokeTokenUser = async (userId) => {
  const activeTokens = await RefreshToken.find({ userId, revoked: false });
  await Promise.all(activeTokens.map((t) => revokeToken(t)));

  // Kills every currently-live access token for this user instantly
  const accessTokenMaxLifetimeSeconds = 15 * 60; // match access token expiry
  await redisServices.setUserRevokeAllBefore(
    userId,
    accessTokenMaxLifetimeSeconds,
  );
};

export const rotateRefreshToken = async (storedToken) => {
  const newRefreshToken = generateRefreshToken();
  const newRefreshTokenHash = hashToken(newRefreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  await revokeToken(storedToken);

  await RefreshToken.create({
    userId: storedToken.userId,
    tokenHash: newRefreshTokenHash,
    familyId: storedToken.familyId,
    expiresAt,
  });

  return { newRefreshToken, expiresAt };
};
