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
    const { user, token, refreshToken, refreshTokenExpiresAt } =
      await authService.loginUser(req.body);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: refreshTokenExpiresAt,
    });
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
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    await authService.verifyUserAccount(email, otp);
    res.status(200).json({
      success: true,
      message: 'Email has been verified successfully.You can now log in.',
    });
  } catch (error) {
    return next(error);
  }
};
export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const { token, newRefreshToken, refreshTokenExpiresAt } =
      await authService.refreshUser(refreshToken);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: refreshTokenExpiresAt,
    });
    return res.status(200).json({
      success: true,
      data: {
        token,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    await authService.logoutUser(refreshToken, req.token);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return res.status(204).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    return next(error);
  }
};

export const logoutAllDevices = async (req, res, next) => {
  try {
    await authService.logoutUserFromAllDevices(req.user.id);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return res.status(204).json({
      success: true,
      message: 'Logged out from all devices.',
    });
  } catch (error) {
    return next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.requestPasswordResetOtp(email);
    res.status(200).json({
      success: true,
      message:
        'If an account with that email exists, a reset code has been sent.',
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

export const verifyResetOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const { resetToken } = await authService.verifyPasswordResetOtp(email, otp);
    res.status(200).json({
      success: true,
      resetToken,
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, password, passwordConfirm } = req.body;
    await authService.resetPassword(resetToken, password, passwordConfirm);

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully.',
    });
  } catch (err) {
    next(err);
  }
};
