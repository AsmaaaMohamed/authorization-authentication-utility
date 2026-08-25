import * as authService from './auth.service.js';

export const register = async (req, res, next) => {
  try {
    const newUser = await authService.signupUser(req.body);

    res.status(201).json({
      success: true,
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

export const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.loginUser(req.body);

    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });

    return res.status(200).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    return next(error);
  }
};
