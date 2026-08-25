import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './auth.model.js';
import { findByEmail } from './auth.model.js';

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
    { id: user._id, role: user.role },
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
    const error = new Error('An account with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  // create user
  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    passwordConfirm: userData.passwordConfirm,
    isVerified: false,
  });

  return sanitizeUser(newUser);
};

/**
 * Login user
 * @param {object} userData
 * @returns {Promise<User, token>}
 */

export const loginUser = async (userData) => {
  const user = await findByEmail(userData.email);

  if (!user || !(await bcrypt.compare(userData.password, user.password))) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isVerified) {
    const error = new Error('Please verify your email address to login.');
    error.statusCode = 401;
    throw error;
  }

  return { user: sanitizeUser(user), token: signToken(user) };
};
