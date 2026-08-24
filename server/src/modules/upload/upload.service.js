/**
 * File: src/services/cloudinaryService.js
 * Description: Cloudinary service providing buffer stream uploading, transformation presets, responsive URL derivation, dynamic on-the-fly transformations, and asset deletion.
 *
 * Steps:
 * 1. Defines TRANSFORMATION_PRESETS for avatar (500x500 face-detection crop), thumbnail (150x150), medium (600x600), banner (1200x400), and original format.
 * 2. uploadStream converts file buffer to readable stream and pipes directly into cloudinary.uploader.upload_stream wrapped in a Promise.
 * 3. uploadWithPreset applies selected preset configuration and folder organization before streaming.
 * 4. getResponsiveVariants generates derived URL variants (thumbnail, medium, fullSize, roundedAvatar, grayscale) without duplicating storage assets.
 * 5. getTransformedUrl generates custom dynamic URLs from query parameters.
 * 6. deleteAsset destroys physical asset from Cloudinary via cloudinary.uploader.destroy.
 * 7. getAssetMetadata fetches asset details from Cloudinary resource API.
 */

import { Readable } from "stream";
import cloudinary from "../../config/cloudinary.js";

export const TRANSFORMATION_PRESETS = {
  avatar: {
    width: 500,
    height: 500,
    crop: "fill",
    gravity: "face",
    quality: "auto",
    fetch_format: "auto",
  },
  thumbnail: {
    width: 150,
    height: 150,
    crop: "thumb",
    gravity: "auto",
    quality: "auto",
    fetch_format: "auto",
  },
  medium: {
    width: 600,
    height: 600,
    crop: "limit",
    quality: "auto",
    fetch_format: "auto",
  },
  banner: {
    width: 1200,
    height: 400,
    crop: "fill",
    gravity: "auto",
    quality: "auto",
    fetch_format: "auto",
  },
  original: {
    quality: "auto",
    fetch_format: "auto",
  },
};

export const uploadStream = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      },
    );

    Readable.from(buffer).pipe(stream);
  });
};

export const uploadWithPreset = async (
  buffer,
  presetName = "original",
  customOptions = {},
) => {
  const presetConfig =
    TRANSFORMATION_PRESETS[presetName] || TRANSFORMATION_PRESETS.original;

  const uploadOptions = {
    folder: customOptions.folder || "auth-utility",
    transformation: [presetConfig],
    ...customOptions,
  };

  return await uploadStream(buffer, uploadOptions);
};

export const getResponsiveVariants = (publicId) => {
  return {
    thumbnail: cloudinary.url(publicId, {
      width: 150,
      height: 150,
      crop: "thumb",
      gravity: "auto",
      quality: "auto",
      fetch_format: "auto",
      secure: true,
    }),
    medium: cloudinary.url(publicId, {
      width: 600,
      height: 600,
      crop: "limit",
      quality: "auto",
      fetch_format: "auto",
      secure: true,
    }),
    fullSize: cloudinary.url(publicId, {
      quality: "auto",
      fetch_format: "auto",
      secure: true,
    }),
    roundedAvatar: cloudinary.url(publicId, {
      width: 300,
      height: 300,
      crop: "fill",
      gravity: "face",
      radius: "max",
      quality: "auto",
      fetch_format: "auto",
      secure: true,
    }),
    grayscale: cloudinary.url(publicId, {
      effect: "grayscale",
      quality: "auto",
      fetch_format: "auto",
      secure: true,
    }),
  };
};

export const getTransformedUrl = (publicId, transformations = {}) => {
  return cloudinary.url(publicId, {
    ...transformations,
    secure: true,
  });
};

export const deleteAsset = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

export const getAssetMetadata = async (publicId) => {
  return await cloudinary.api.resource(publicId);
};
