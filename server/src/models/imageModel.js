/**
 * File: src/models/imageModel.js
 * Description: Mongoose database schema and model for Cloudinary uploaded asset metadata, dimensions, presets, and responsive derived variants.
 * 
 * Steps:
 * 1. Defines imageSchema with fields for userId association, unique Cloudinary public_id index, and secure_url.
 * 2. Stores physical asset specifications including format, width, height, bytes, folder, and transformation preset.
 * 3. Contains responsiveVariants subdocument storing on-the-fly transformed URLs (thumbnail, medium, fullSize, roundedAvatar, grayscale).
 * 4. Enables automatic timestamping and exports Mongoose Image model.
 */

import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    public_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
    folder: {
      type: String,
      default: 'auth-utility',
    },
    format: {
      type: String,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    bytes: {
      type: Number,
    },
    preset: {
      type: String,
      default: 'original',
      enum: ['avatar', 'thumbnail', 'medium', 'banner', 'original', 'custom'],
    },
    responsiveVariants: {
      thumbnail: { type: String, default: '' },
      medium: { type: String, default: '' },
      fullSize: { type: String, default: '' },
      roundedAvatar: { type: String, default: '' },
      grayscale: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);

export default Image;
