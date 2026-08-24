import * as authService from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    return res.status(201).json({ success: true, user });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body);
    res.cookie("token", result.token, { httpOnly: true, sameSite: "lax" });
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return next(error);
  }
};
