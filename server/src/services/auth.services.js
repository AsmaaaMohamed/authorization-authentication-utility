import User from '../models/user.model.js';

/**
 * Signup a new user
 * @param {object} userData
 * @returns {Promise<User>}
 */

export const signupUser = async (userData) => {
  // create user
  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    passwordConfirm: userData.passwordConfirm,
    isVerified: false,
  });

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    isVerified: newUser.isVerified,
  };
};
