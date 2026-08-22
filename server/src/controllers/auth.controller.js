// Register a new user

import * as AuthServices from '../services/auth.services.js';

export const register = async (req, res, next) => {
  try {
    const newUser = await AuthServices.signupUser(req.body);

    res.status(201).json({
      status: 'success',
      message:
        'Account created! Please check your email to verify your account.',
      data: {
        newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};
