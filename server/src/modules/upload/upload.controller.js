/**
 * File: src/controllers/uploadController.js
 * Description: Controller handlers for Cloudinary image uploading with presets, avatar face-cropping, on-the-fly transformations, metadata retrieval, and asset deletion.
 *
 * Steps:
 * 1. uploadImage streams uploaded file buffer with selected transformation preset, generates responsive variants, and persists record in MongoDB Image collection.
 * 2. uploadAvatar streams avatar image with AI face-detection crop (500x500 fill) and updates/upserts image document.
 * 3. getTransformedUrl processes transformation query parameters (width, height, crop, effect, radius, quality) and returns dynamic Cloudinary URLs.
 * 4. deleteImage destroys physical asset in Cloudinary using public_id and removes corresponding MongoDB record.
 * 5. getImageMetadata queries database and Cloudinary for asset specifications and derived responsive variants.
 */

import * as cloudinaryService from "./upload.service.js";
import {
  createImage,
  deleteByPublicId,
  findByPublicId,
  upsertImage,
} from "./image.model.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided. Please attach an image field.",
      });
    }

    const { preset = "original", folder = "auth-utility", userId } = req.body;

    const result = await cloudinaryService.uploadWithPreset(
      req.file.buffer,
      preset,
      {
        folder,
      },
    );

    const responsiveVariants = cloudinaryService.getResponsiveVariants(
      result.public_id,
    );

    const imageDoc = await createImage({
      userId: userId || null,
      public_id: result.public_id,
      secure_url: result.secure_url,
      folder,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      preset,
      responsiveVariants,
    });

    return res.status(201).json({
      success: true,
      message: "Image uploaded and processed successfully.",
      data: imageDoc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while uploading image.",
    });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No avatar image file provided.",
      });
    }

    const userId = req.body.userId || req.user?._id;
    const customPublicId = userId ? `avatar_${userId}` : undefined;

    const result = await cloudinaryService.uploadWithPreset(
      req.file.buffer,
      "avatar",
      {
        folder: "auth-utility/avatars",
        public_id: customPublicId,
        overwrite: true,
      },
    );

    const responsiveVariants = cloudinaryService.getResponsiveVariants(
      result.public_id,
    );

    const imageDoc = await upsertImage(result.public_id, {
      userId: userId || null,
      public_id: result.public_id,
      secure_url: result.secure_url,
      folder: "auth-utility/avatars",
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      preset: "avatar",
      responsiveVariants,
    });

    return res.status(200).json({
      success: true,
      message: "Avatar uploaded and optimized successfully.",
      data: imageDoc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while uploading avatar.",
    });
  }
};

export const getTransformedUrl = async (req, res) => {
  try {
    const publicId =
      req.params.publicId || req.query.publicId || req.body.publicId;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required.",
      });
    }

    const { width, height, crop, effect, radius, quality, fetch_format } =
      req.query;

    const transformations = {};
    if (width) transformations.width = Number(width) || width;
    if (height) transformations.height = Number(height) || height;
    if (crop) transformations.crop = crop;
    if (effect) transformations.effect = effect;
    if (radius) transformations.radius = radius;
    if (quality) transformations.quality = quality;
    if (fetch_format) transformations.fetch_format = fetch_format;

    const transformedUrl = cloudinaryService.getTransformedUrl(
      publicId,
      transformations,
    );
    const responsiveVariants =
      cloudinaryService.getResponsiveVariants(publicId);

    return res.status(200).json({
      success: true,
      public_id: publicId,
      transformedUrl,
      responsiveVariants,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error generating transformed URL.",
    });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const publicId =
      req.params.publicId || req.query.publicId || req.body.publicId;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required to delete an image.",
      });
    }

    const cloudinaryResult = await cloudinaryService.deleteAsset(publicId);
    const dbResult = await deleteByPublicId(publicId);

    return res.status(200).json({
      success: true,
      message: "Asset successfully deleted from Cloudinary and database.",
      cloudinaryStatus: cloudinaryResult.result,
      databaseRecordDeleted: Boolean(dbResult),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error while deleting image.",
    });
  }
};

export const getImageMetadata = async (req, res) => {
  try {
    const publicId =
      req.params.publicId || req.query.publicId || req.body.publicId;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required.",
      });
    }

    const dbImage = await findByPublicId(publicId);

    return res.status(200).json({
      success: true,
      data: dbImage || null,
      responsiveVariants: cloudinaryService.getResponsiveVariants(publicId),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error retrieving image metadata.",
    });
  }
};
