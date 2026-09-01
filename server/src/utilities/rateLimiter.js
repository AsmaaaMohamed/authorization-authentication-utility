import { rateLimit, ipKeyGenerator } from 'express-rate-limit';

/**
 * Creates a configurable Express rate-limiting middleware.
 *
 * Wraps `express-rate-limit` in a factory so different routes can apply
 * different limits, keying strategies, and error messages instead of
 * sharing one global limiter.
 *
 * @param {number} [windowMinutes=10] - Length of the rate-limit window, in minutes.
 * @param {number} [limit=10] - Maximum number of requests a client can make
 *   within `windowMinutes` before being blocked.
 * @param {(req: import('express').Request) => string} [keyGenerator]
 *   Function that determines how clients are identified/grouped for limiting.
 * @param {string} [message] - Custom message returned in the 429 response body.
 *
 * @returns {import('express').RequestHandler}
 */
export const limiter = ({
  windowMinutes = 10,
  limit = 10,
  keyGenerator = (req) => ipKeyGenerator(req.ip),
  message,
}) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message:
          message ||
          `Too many requests. Please try again later. please try after ${windowMinutes} minutes`,
      });
    },
    keyGenerator,
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const RATE_LIMITS = {
  GLOBAL: {
    windowMinutes: 15,
    limit: 100,
  },

  LOGIN: {
    windowMinutes: 15,
    limit: 5,
    keyGenerator: (req) => `${ipKeyGenerator(req.ip)}:${req.body?.email}`,
    message: 'Too many login attempts. Please try again later.',
  },

  REGISTER: {
    windowMinutes: 60,
    limit: 5,
    message: 'Too many registration attempts. Please try again later.',
  },

  FORGOT_PASSWORD: {
    windowMinutes: 60,
    limit: 3,
    keyGenerator: (req) => `${ipKeyGenerator(req.ip)}:${req.body?.email}`,
    message: 'Too many password reset requests. Please try again later.',
  },

  VERIFY_OTP: {
    windowMinutes: 10,
    limit: 5,
    keyGenerator: (req) => `${ipKeyGenerator(req.ip)}:${req.body?.email}`,
    message: 'Too many OTP verification attempts. Please try again later.',
  },

  RESEND_OTP: {
    windowMinutes: 60,
    limit: 3,
    keyGenerator: (req) => `${ipKeyGenerator(req.ip)}:${req.body?.email}`,
    message: 'Too many OTP resend requests. Please try again later.',
  },

  REFRESH_TOKEN: {
    windowMinutes: 15,
    limit: 25,
  },
};
