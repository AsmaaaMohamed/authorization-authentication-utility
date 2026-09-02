/**
 * File: src/services/redisService.js
 * Description: Redis caching and security service providing OTP storage with TTL/attempt rate-limiting, JWT token blacklisting, and generic key-value cache operations with in-memory fallback.
 *
 * Steps:
 * 1. Maintains in-memory Map fallback store with auto-expiry timestamps for development resilience when Redis is offline.
 * 2. setOtp stores user OTPs serialized with remaining attempt counts and Time-To-Live expiration (default: 300s).
 * 3. verifyOtp validates submitted OTP, auto-deletes on match, decrements remaining attempts on failure, and locks/deletes key on exceeding attempts.
 * 4. deleteOtp provides explicit invalidation of active OTP keys.
 * 5. blacklistToken records revoked JWT tokens with expiration TTL upon logout or password reset.
 * 6. isTokenBlacklisted checks token revocation status for request authorization guarding.
 * 7. set, get, del, exists provide generic JSON-safe caching primitives across the application.
 */

import crypto from 'crypto';
import { redisClient, isRedisConnected } from './redis.js';

// helper function for hashing raw token
const hashIdentifier = (value) =>
  crypto.createHash('sha256').update(value).digest('hex');

// helper for building otp key to store in redis
const buildOtpKey = (purpose, identifier) =>
  `${purpose}:${identifier.toLowerCase().trim()}`;

const memoryStore = new Map();

const setInMemory = (key, value, ttlSeconds) => {
  const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
  memoryStore.set(key, { value, expiresAt });
};

const getFromMemory = (key) => {
  const item = memoryStore.get(key);
  if (!item) return null;
  if (item.expiresAt && Date.now() > item.expiresAt) {
    memoryStore.delete(key);
    return null;
  }
  return item.value;
};

export const setOtp = async (
  identifier,
  otp,
  { ttlSeconds = 300, maxAttempts = 3, purpose = 'otp' } = {},
) => {
  const key = buildOtpKey(purpose, identifier);
  console.log(key);
  const payload = JSON.stringify({
    otpHash: hashIdentifier(String(otp).trim()),
    attemptsRemaining: maxAttempts,
    createdAt: Date.now(),
  });

  try {
    if (isRedisConnected && redisClient.status === 'ready') {
      await redisClient.set(key, payload, 'EX', ttlSeconds);
    } else {
      setInMemory(key, payload, ttlSeconds);
    }
    return true;
  } catch (err) {
    setInMemory(key, payload, ttlSeconds);
    return true;
  }
};

export const verifyOtp = async (
  identifier,
  inputOtp,
  { purpose = 'otp' } = {},
) => {
  const key = buildOtpKey(purpose, identifier);
  let rawData = null;
  console.log(key);
  try {
    if (isRedisConnected && redisClient.status === 'ready') {
      console.log('redis connected');
      console.log(redisClient.status);
      rawData = await redisClient.get(key);
    } else {
      rawData = getFromMemory(key);
    }
  } catch (err) {
    rawData = getFromMemory(key);
  }
  console.log(rawData);
  if (!rawData) {
    return {
      valid: false,
      message: 'OTP has expired or does not exist. Please request a new code.',
    };
  }

  const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
  const submittedHash = hashIdentifier(String(inputOtp).trim());

  if (data.otpHash === submittedHash) {
    await deleteOtp(identifier, { purpose });
    return {
      valid: true,
      message: 'OTP verified successfully.',
    };
  }

  data.attemptsRemaining -= 1;

  if (data.attemptsRemaining <= 0) {
    await deleteOtp(identifier, { purpose });
    return {
      valid: false,
      message:
        'Maximum verification attempts exceeded. Please request a new OTP.',
      attemptsRemaining: 0,
    };
  }

  try {
    if (isRedisConnected && redisClient.status === 'ready') {
      const ttl = await redisClient.ttl(key);
      if (ttl > 0) {
        await redisClient.set(key, JSON.stringify(data), 'EX', ttl);
      }
    } else {
      const item = memoryStore.get(key);
      const remainingSeconds = item?.expiresAt
        ? Math.max(1, Math.round((item.expiresAt - Date.now()) / 1000))
        : 300;

      setInMemory(key, JSON.stringify(data), remainingSeconds);
    }
  } catch (err) {
    setInMemory(key, JSON.stringify(data), 300);
  }

  return {
    valid: false,
    message: `Invalid OTP. ${data.attemptsRemaining} attempt(s) remaining.`,
    attemptsRemaining: data.attemptsRemaining,
  };
};

export const deleteOtp = async (identifier, { purpose = 'otp' } = {}) => {
  const key = buildOtpKey(purpose, identifier);

  try {
    if (isRedisConnected && redisClient.status === 'ready') {
      await redisClient.del(key);
    }
  } catch (err) {}
  memoryStore.delete(key);
  return true;
};

// One-time reset-authorization token, issued after a successful OTP verification
export const generateResetToken = async (userId, ttlSeconds = 600) => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const key = `resetToken:${hashIdentifier(rawToken)}`;

  try {
    if (isRedisConnected && redisClient.status === 'ready') {
      await redisClient.set(key, String(userId), 'EX', ttlSeconds);
    } else {
      setInMemory(key, String(userId), ttlSeconds);
    }
  } catch (err) {
    setInMemory(key, String(userId), ttlSeconds);
  }

  return rawToken;
};

export const consumeResetToken = async (rawToken) => {
  if (!rawToken) return null;

  const key = `resetToken:${hashIdentifier(rawToken)}`;
  let userId = null;

  try {
    if (isRedisConnected && redisClient.status === 'ready') {
      userId = await redisClient.get(key);
    } else {
      userId = getFromMemory(key);
    }
  } catch (err) {
    userId = getFromMemory(key);
  }

  if (!userId) return null;

  try {
    if (isRedisConnected && redisClient.status === 'ready') {
      await redisClient.del(key);
    }
  } catch (err) {}
  memoryStore.delete(key);

  return userId;
};

export const blacklistToken = async (token, ttlSeconds) => {
  if (!token) return false;
  if (!ttlSeconds || ttlSeconds <= 0) return false;

  const key = `blacklist:${hashIdentifier(token)}`;

  try {
    if (isRedisConnected && redisClient.status === 'ready') {
      await redisClient.set(key, '1', 'EX', ttlSeconds);
    } else {
      setInMemory(key, '1', ttlSeconds);
    }
    return true;
  } catch (err) {
    setInMemory(key, '1', ttlSeconds);
    return true;
  }
};

export const isTokenBlacklisted = async (token) => {
  if (!token) return false;

  const key = `blacklist:${hashIdentifier(token)}`;

  try {
    if (isRedisConnected && redisClient.status === 'ready') {
      const exists = await redisClient.exists(key);
      return exists === 1;
    }
    return getFromMemory(key) !== null;
  } catch (err) {
    return getFromMemory(key) !== null;
  }
};

// logout everywhere
export const setUserRevokeAllBefore = async (userId, ttlSeconds) => {
  const key = `revokeAllBefore:${userId}`;
  const value = String(Date.now());

  try {
    if (isRedisConnected && redisClient.status === 'ready') {
      await redisClient.set(key, value, 'EX', ttlSeconds);
    } else {
      setInMemory(key, value, ttlSeconds);
    }
  } catch (err) {
    setInMemory(key, value, ttlSeconds);
  }
};

export const getUserRevokeAllBefore = async (userId) => {
  const key = `revokeAllBefore:${userId}`;

  try {
    if (isRedisConnected && redisClient.status === 'ready') {
      const val = await redisClient.get(key);
      return val ? Number(val) : null;
    }
    const val = getFromMemory(key);
    return val ? Number(val) : null;
  } catch (err) {
    const val = getFromMemory(key);
    return val ? Number(val) : null;
  }
};

export const set = async (key, value, ttlSeconds = null) => {
  const payload =
    typeof value === 'object' ? JSON.stringify(value) : String(value);
  try {
    if (isRedisConnected && redisClient.status === 'ready') {
      if (ttlSeconds) {
        await redisClient.set(key, payload, 'EX', ttlSeconds);
      } else {
        await redisClient.set(key, payload);
      }
    } else {
      setInMemory(key, payload, ttlSeconds);
    }
    return true;
  } catch (err) {
    setInMemory(key, payload, ttlSeconds);
    return true;
  }
};

export const get = async (key) => {
  try {
    if (isRedisConnected && redisClient.status === 'ready') {
      const val = await redisClient.get(key);
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    }
    const val = getFromMemory(key);
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  } catch (err) {
    const val = getFromMemory(key);
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
};

export const del = async (key) => {
  try {
    if (isRedisConnected && redisClient.status === 'ready') {
      await redisClient.del(key);
    }
  } catch (err) {}
  memoryStore.delete(key);
  return true;
};

export const exists = async (key) => {
  try {
    if (isRedisConnected && redisClient.status === 'ready') {
      const count = await redisClient.exists(key);
      return count === 1;
    }
    return memoryStore.has(key);
  } catch (err) {
    return memoryStore.has(key);
  }
};

export default {
  setOtp,
  verifyOtp,
  deleteOtp,
  generateResetToken,
  consumeResetToken,
  blacklistToken,
  isTokenBlacklisted,
  setUserRevokeAllBefore,
  getUserRevokeAllBefore,
  set,
  get,
  del,
  exists,
};
