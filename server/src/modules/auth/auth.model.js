import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, 'Password is required'] },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    avatar: {
      public_id: { type: String, default: '' },
      secure_url: { type: String, default: '' },
    },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export const findByEmail = (email) => User.findOne({ email });

export const createUser = (userData) => User.create(userData);

export const findPublicById = (userId) =>
  User.findById(userId).select('-password -verifyOtp -resetOtp');

export default User;
