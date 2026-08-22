// User model for user's data
import mongoose from 'mongoose';
import bycrypt from 'bcryptjs';
const { Schema } = mongoose;

// Define the User Schema
const userSchema = new Schema(
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
      minLength: [8, 'Password should be at least 8 characters'],
      select: false,
    },

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

    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
      },

      default: 'user',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    avatar: { type: String, default: '' },
  },
  { timestamps: true },
);

// Pre save middleware to hash the password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bycrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

export default mongoose.model('User', userSchema);
