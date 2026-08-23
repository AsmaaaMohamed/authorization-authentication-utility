/**
 * File: src/controllers/userController.js
 * Description: Controller handlers for user profile queries and RBAC-protected administrative dashboard operations.
 * 
 * Steps:
 * 1. getUserData queries MongoDB User collection using req.user.id attached by authentication middleware.
 * 2. Excludes sensitive fields (password, verifyOtp, resetOtp) and returns 200 OK with sanitized user profile.
 * 3. Returns 404 if user profile is missing.
 * 4. getAdminDashboard returns administrative status and server timestamp for authorized admin users.
 * 5. Handles internal server exceptions with 500 status codes.
 */

import User from '../models/userModel.js';

export const getUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password -verifyOtp -resetOtp');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
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
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user profile.',
    });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Access granted to Admin Dashboard.',
      user: req.user,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error accessing admin panel.',
    });
  }
};
