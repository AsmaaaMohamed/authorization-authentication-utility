import * as userService from './user.service.js';
import AppError from '../../utilities/AppError.js';

export const getUserData = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);

    if (!user) {
      throw new AppError('User profile not found.', 404);
    }

    return res.status(200).json({
      success: true,
      userData: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};

export const getAdminDashboard = (req, res) =>
  res.status(200).json({
    success: true,
    message: 'Access granted to Admin Dashboard.',
    user: req.user,
    timestamp: new Date().toISOString(),
  });
