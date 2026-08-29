import { findPublicById } from './user.model.js';

export const getUserById = (userId) => findPublicById(userId);

/**
 * Check whether a user exists.
 *
 * @param {string} userId - User ID.
 * @returns {Promise<boolean>} True if the user exists, otherwise false.
 */
export const userExists = async (userId) => {
  const user = await findPublicById(userId);

  return !!user;
};

/**
 * Check whether a user exists by email.
 *
 * @param {string} email - User email.
 * @returns {Promise<boolean>} True if the user exists, otherwise false.
 */
export const userExistsByEmail = async (email) => {
  const user = await User.findOne({ email });

  return !!user;
};
