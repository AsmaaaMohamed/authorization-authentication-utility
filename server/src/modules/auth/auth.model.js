import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

    passwordConfirm: {
      type: String,
      required: [true, 'Confirm your password'],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'Please enter the same password',
      },
    },

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

// Pre save middleware to hash the password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export const findByEmail = (email) => User.findOne({ email });

export const findPublicById = (userId) =>
  User.findById(userId).select('-password -verifyOtp -resetOtp');

export default User;
