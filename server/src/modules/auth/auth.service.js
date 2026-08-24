import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findByEmail } from "./auth.model.js";

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await findByEmail(email);
  if (existingUser) {
    const error = new Error("An account with this email already exists.");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await createUser({ name, email, password: hashedPassword });
  return sanitizeUser(user);
};

export const loginUser = async ({ email, password }) => {
  const user = await findByEmail(email);
  const isPasswordValid =
    user && (await bcrypt.compare(password, user.password));

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || "jwt_secret_key_default",
    { expiresIn: "1d" },
  );

  return { user: sanitizeUser(user), token };
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  avatar: user.avatar,
});
