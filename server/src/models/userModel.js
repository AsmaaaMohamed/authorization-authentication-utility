/**
 * File: src/models/userModel.js
 * Description: Mongoose database schema and model for User accounts, authentication credentials, roles, avatars, and verification OTPs.
 * 
 * Steps:
 * 1. Defines userSchema with validation rules for name, unique lowercase email, and hashed password.
 * 2. Establishes RBAC role field with enum ['user', 'admin'] defaulting to 'user'.
 * 3. Includes avatar subdocument for Cloudinary public_id and secure_url tracking.
 * 4. Configures verification and password reset OTP fields with expiration timestamps.
 * 5. Enables automatic createdAt and updatedAt timestamps.
 * 6. Instantiates and exports Mongoose User model.
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      public_id: { type: String, default: '' },
      secure_url: { type: String, default: '' },
    },
    verifyOtp: {
      type: String,
      default: '',
    },
    verifyOtpExpireAt: {
      type: Number,
      default: 0,
    },
    resetOtp: {
      type: String,
      default: '',
    },
    resetOtpExpireAt: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
