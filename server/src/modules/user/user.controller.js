import * as userService from "./user.service.js";

export const getUserData = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User profile not found." });
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
    return res
      .status(500)
      .json({
        success: false,
        message: error.message || "Server error fetching user profile.",
      });
  }
};

export const getAdminDashboard = (req, res) =>
  res.status(200).json({
    success: true,
    message: "Access granted to Admin Dashboard.",
    user: req.user,
    timestamp: new Date().toISOString(),
  });
