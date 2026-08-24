import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    public_id: { type: String, required: true, unique: true, index: true },
    secure_url: { type: String, required: true },
    folder: { type: String, default: "auth-utility" },
    format: String,
    width: Number,
    height: Number,
    bytes: Number,
    preset: {
      type: String,
      default: "original",
      enum: ["avatar", "thumbnail", "medium", "banner", "original", "custom"],
    },
    responsiveVariants: {
      thumbnail: { type: String, default: "" },
      medium: { type: String, default: "" },
      fullSize: { type: String, default: "" },
      roundedAvatar: { type: String, default: "" },
      grayscale: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

const Image = mongoose.models.Image || mongoose.model("Image", imageSchema);

export const createImage = (imageData) => Image.create(imageData);

export const upsertImage = (publicId, imageData) =>
  Image.findOneAndUpdate({ public_id: publicId }, imageData, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });

export const findByPublicId = (publicId) =>
  Image.findOne({ public_id: publicId });

export const deleteByPublicId = (publicId) =>
  Image.findOneAndDelete({ public_id: publicId });

export default Image;
